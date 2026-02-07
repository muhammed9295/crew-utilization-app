import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';

@Controller('daily-logs')
export class DailyLogsController {
    constructor(private readonly dailyLogsService: DailyLogsService) { }

    @Post()
    create(@Body() createDailyLogDto: any) {
        return this.dailyLogsService.create(createDailyLogDto);
    }

    @Get('stats')
    getDashboardStats(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.dailyLogsService.getDashboardStats(startDate, endDate);
    }

    @Get('revenue')
    getMonthlyRevenue(
        @Query('year') year: number,
    ) {
        return this.dailyLogsService.getMonthlyRevenue(year);
    }

    @Get()
    findAll(
        @Query('date') date: string,
        @Query('zoneId') zoneId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('role') role: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.dailyLogsService.findAll(date, zoneId, startDate, endDate, role, Number(page), Number(limit));
    }
}
