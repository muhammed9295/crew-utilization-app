import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyLog } from '../entities/daily-log.entity';
import { Crew } from '../entities/crew.entity';
import { Zone } from '../entities/zone.entity';

@Injectable()
export class DailyLogsService {
    constructor(
        @InjectRepository(DailyLog)
        private dailyLogsRepository: Repository<DailyLog>,
        @InjectRepository(Crew)
        private crewRepository: Repository<Crew>,
        @InjectRepository(Zone)
        private zoneRepository: Repository<Zone>,
    ) { }

    async getDashboardStats(startDate?: string, endDate?: string) {
        // 1. Total Crews
        const totalCrew = await this.crewRepository.count();

        // 2. Active Crews (crews with logs in the date range)
        const activeCrewsQuery = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .select('COUNT(DISTINCT daily_log.crewId)', 'count');

        // Calculate days in range for scheduled hours
        // Helper to count working days (Sun, Mon, Tue, Wed, Thu, Sat) - Excluding Friday (5)
        const getWorkingDaysInRange = (start: Date, end: Date) => {
            let count = 0;
            const curDate = new Date(start.getTime());
            while (curDate <= end) {
                const dayOfWeek = curDate.getDay();
                if (dayOfWeek !== 5) { // 5 is Friday
                    count++;
                }
                curDate.setDate(curDate.getDate() + 1);
            }
            return count;
        };

        let daysInRange = 0;
        let workingDays = 0;

        // Helper to get YYYY-MM-DD from a date object (local time)
        const toISODate = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

        const todayStr = toISODate(new Date());

        if (startDate && endDate) {
            // Cap end date at today if it's in the future (lexicographical comparison works for YYYY-MM-DD)
            const effectiveEndDate = endDate > todayStr ? todayStr : endDate;

            // If effective end date is BEFORE start date, then range is 0 (or invalid)
            if (effectiveEndDate < startDate) {
                daysInRange = 0;
                workingDays = 0;
            } else {
                // Parse as UTC to avoid timezone/DST offsets when diffing
                // We use UTC to ensure we iterate correctly over calendar days
                const start = new Date(startDate + 'T00:00:00Z');
                const end = new Date(effectiveEndDate + 'T00:00:00Z');

                // Calculate simple days in range (for reference if needed, but critical is workingDays)
                const diffTime = Math.abs(end.getTime() - start.getTime());
                daysInRange = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                // Calculate working days
                workingDays = getWorkingDaysInRange(start, end);
            }

            activeCrewsQuery.where('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            // Case: Just startDate provided (e.g. from today onwards? or specific day? logic was ambiguous in original code)
            // Assuming simplified logic: if generic range, we default to last 30 days
            activeCrewsQuery.where('daily_log.date >= :startDate', { startDate });
            // Fallback for startDate only not fully implemented in original regarding daysInRange, keeping safe default or calc
            // If this path is used for "Today", startDate == todayStr
            if (startDate === todayStr) {
                const d = new Date(startDate + 'T00:00:00Z');
                workingDays = d.getDay() !== 5 ? 1 : 0;
            }
        } else {
            // Default 30 days
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);

            // Re-align to midnight UTC for consistent counting
            const uStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
            const uEnd = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

            workingDays = getWorkingDaysInRange(uStart, uEnd);
        }

        const activeCrewsResult = await activeCrewsQuery.getRawOne();
        const activeCrews = parseInt(activeCrewsResult.count, 10);

        // 3. Utilization Rate = (Total worked hours / Total scheduled hours) * 100

        // Total Scheduled Hours = Sum of (Crew.scheduledHours) * workingDays
        const { totalDailyScheduled } = await this.crewRepository.createQueryBuilder('crew')
            .select('SUM(crew.scheduledHours)', 'totalDailyScheduled')
            .where('crew.status = :status', { status: 'Active' })
            .getRawOne();

        // Use workingDays instead of generic daysInRange
        const totalScheduledHours = (parseFloat(totalDailyScheduled) || 0) * workingDays;

        // Total Worked Hours
        const workedHoursQuery = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .select('SUM(daily_log.hoursWorked)', 'totalWorked');

        if (startDate && endDate) {
            workedHoursQuery.where('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            workedHoursQuery.where('daily_log.date >= :startDate', { startDate });
        }

        const { totalWorked } = await workedHoursQuery.getRawOne();
        const totalWorkedHours = parseFloat(totalWorked) || 0;

        const utilizationRate = totalScheduledHours > 0
            ? Math.round((totalWorkedHours / totalScheduledHours) * 100)
            : 0;

        // 3.5 Total Revenue
        const revenueQuery = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .select('SUM(daily_log.totalRevenue)', 'revenue_sum');

        if (startDate && endDate) {
            revenueQuery.where('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            revenueQuery.where('daily_log.date >= :startDate', { startDate });
        }

        const revenueResult = await revenueQuery.getRawOne();
        console.log('[DEBUG] Revenue Result:', revenueResult);
        const revenue = revenueResult && revenueResult.revenue_sum ? parseFloat(revenueResult.revenue_sum) : 0;

        // 4. Total Zones
        const totalZones = await this.zoneRepository.count();

        // 5. Crew Allocation & Zone Utilization
        // We need: Zone Name, Technician Count, Cleaner Count, AND Zone Utilization
        // Zone Utilization = (Sum Worked Hours in Zone / (Sum Scheduled Hours of Crews in Zone * workingDays)) * 100

        const zoneAllocationQuery = this.crewRepository.createQueryBuilder('crew')
            .leftJoin('crew.zone', 'zone')
            .select('zone.name', 'zoneName')
            .addSelect('zone.id', 'zoneId') // Add ID for joining/grouping
            .addSelect('COUNT(crew.id)', 'crewCount')
            .addSelect('SUM(CASE WHEN crew.role = \'Technician\' THEN 1 ELSE 0 END)', 'technicianCount')
            .addSelect('SUM(CASE WHEN crew.role = \'Cleaner\' THEN 1 ELSE 0 END)', 'cleanerCount')
            .addSelect('SUM(crew.scheduledHours)', 'zoneDailyCapacity')
            // Capacity per role
            .addSelect('SUM(CASE WHEN crew.role = \'Technician\' THEN crew.scheduledHours ELSE 0 END)', 'technicianDailyCapacity')
            .addSelect('SUM(CASE WHEN crew.role = \'Cleaner\' THEN crew.scheduledHours ELSE 0 END)', 'cleanerDailyCapacity')
            .groupBy('zone.id')
            .addGroupBy('zone.name');

        let zoneStats = await zoneAllocationQuery.getRawMany();

        // Now we need Worked Hours per Zone to calculate rate.
        // We can do this with a separate query or subquery. 
        // Let's use a separate query for worked hours per zone and map it.
        // Worked Hours per Zone matches Crew's Zone.

        const zoneWorkedHoursQuery = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .leftJoin('daily_log.crew', 'crew')
            .leftJoin('crew.zone', 'zone')
            .select('zone.id', 'zoneId')
            .addSelect('SUM(daily_log.hoursWorked)', 'workedHours')
            // Worked hours per role
            .addSelect('SUM(CASE WHEN crew.role = \'Technician\' THEN daily_log.hoursWorked ELSE 0 END)', 'technicianWorked')
            .addSelect('SUM(CASE WHEN crew.role = \'Cleaner\' THEN daily_log.hoursWorked ELSE 0 END)', 'cleanerWorked')
            .groupBy('zone.id');

        if (startDate && endDate) {
            zoneWorkedHoursQuery.where('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            zoneWorkedHoursQuery.where('daily_log.date >= :startDate', { startDate });
        }

        const zoneWorkedHours = await zoneWorkedHoursQuery.getRawMany();
        const workedHoursMap = new Map(zoneWorkedHours.map(z => [z.zoneId, {
            total: parseFloat(z.workedHours) || 0,
            technician: parseFloat(z.technicianWorked) || 0,
            cleaner: parseFloat(z.cleanerWorked) || 0
        }]));

        // Calculate active crew count per zone (for previous pie chart or generic usage)
        // Re-using the logic from before or just counting unique crewIds in logs per zone
        const zoneActiveQuery = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .leftJoin('daily_log.crew', 'crew')
            .leftJoin('crew.zone', 'zone')
            .select('zone.id', 'zoneId')
            .addSelect('COUNT(DISTINCT daily_log.crewId)', 'activeCrewCount')
            .groupBy('zone.id');

        if (startDate && endDate) {
            zoneActiveQuery.where('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            zoneActiveQuery.where('daily_log.date >= :startDate', { startDate });
        }

        const zoneActiveCounts = await zoneActiveQuery.getRawMany();
        const activeCountMap = new Map(zoneActiveCounts.map(z => [z.zoneId, parseInt(z.activeCrewCount) || 0]));

        // Merge stats
        const zoneAllocation = zoneStats.map(zone => {
            const workedData = workedHoursMap.get(zone.zoneId) || { total: 0, technician: 0, cleaner: 0 };
            const worked = workedData.total;
            const dailyCapacity = parseFloat(zone.zoneDailyCapacity) || 0;
            // Use workingDays here instead of daysInRange
            const totalCapacity = dailyCapacity * workingDays;

            // Role specific
            const techDailyCap = parseFloat(zone.technicianDailyCapacity) || 0;
            const cleanerDailyCap = parseFloat(zone.cleanerDailyCapacity) || 0;
            // Use workingDays here
            const techTotalCap = techDailyCap * workingDays;
            const cleanerTotalCap = cleanerDailyCap * workingDays;

            const utilization = totalCapacity > 0
                ? Math.round((worked / totalCapacity) * 100)
                : 0;

            const technicianUtilization = techTotalCap > 0
                ? Math.round((workedData.technician / techTotalCap) * 100)
                : 0;

            const cleanerUtilization = cleanerTotalCap > 0
                ? Math.round((workedData.cleaner / cleanerTotalCap) * 100)
                : 0;

            return {
                ...zone,
                activeCrewCount: activeCountMap.get(zone.zoneId) || 0,
                workedHours: worked,
                totalCapacity,
                utilizationRate: utilization,
                technicianUtilization,
                cleanerUtilization
            };
        });

        return {
            totalCrew,
            activeCrews,
            utilizationRate,
            totalRevenue: revenue,
            totalZones,
            zoneAllocation
        };
    }

    async create(createDailyLogDto: any) {
        const logsToProcess = Array.isArray(createDailyLogDto) ? createDailyLogDto : [createDailyLogDto];
        const results: DailyLog[] = [];

        for (const logDto of logsToProcess) {
            const existingLog = await this.dailyLogsRepository.findOne({
                where: {
                    date: logDto.date,
                    crewId: logDto.crewId
                }
            });

            if (existingLog) {
                // Update existing
                const updated = this.dailyLogsRepository.merge(existingLog, logDto);
                results.push(await this.dailyLogsRepository.save(updated));
            } else {
                // Create new
                const newLog = this.dailyLogsRepository.create(logDto);
                const saved = await this.dailyLogsRepository.save(newLog);
                results.push(Array.isArray(saved) ? saved[0] : saved);
            }
        }
        return results;
    }

    async findAll(date?: string, zoneId?: string, startDate?: string, endDate?: string, role?: string, page: number = 1, limit: number = 10): Promise<{ data: DailyLog[], total: number }> {
        const query = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .leftJoinAndSelect('daily_log.crew', 'crew')
            .leftJoinAndSelect('crew.zone', 'zone')
            .orderBy('daily_log.date', 'DESC');

        if (date) {
            query.andWhere('daily_log.date = :date', { date });
        }

        if (startDate && endDate) {
            query.andWhere('daily_log.date BETWEEN :startDate AND :endDate', { startDate, endDate });
        } else if (startDate) {
            query.andWhere('daily_log.date >= :startDate', { startDate });
        }

        if (zoneId && zoneId !== 'all') {
            query.andWhere('zone.id = :zoneId', { zoneId });
        }

        if (role && role !== 'all') {
            query.andWhere('crew.role = :role', { role });
        }

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }

    async getMonthlyRevenue(year: number) {
        const query = this.dailyLogsRepository.createQueryBuilder('daily_log')
            .select('EXTRACT(MONTH FROM daily_log.date)', 'month')
            .addSelect('SUM(daily_log.totalRevenue)', 'totalRevenue')
            .where('EXTRACT(YEAR FROM daily_log.date) = :year', { year })
            .groupBy('month')
            .orderBy('month', 'ASC');

        const results = await query.getRawMany();

        // Initialize array for 12 months with 0 revenue
        const monthlyRevenue = Array(12).fill(0);

        results.forEach(result => {
            const monthIndex = parseInt(result.month) - 1; // EXTRACT(MONTH) returns 1-12
            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyRevenue[monthIndex] = parseFloat(result.totalRevenue) || 0;
            }
        });

        return {
            year,
            monthlyRevenue
        };
    }
}
