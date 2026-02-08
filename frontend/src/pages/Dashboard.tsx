import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import type { DateRange } from "react-day-picker"
import { toast } from "sonner"
import { StatCard } from "@/components/shared/StatCard"
import { AllocationChart } from "@/components/dashboard/AllocationChart"
import { RevenueLineChart } from "@/components/dashboard/RevenueLineChart"
import { ZoneUtilizationPieChart } from "@/components/dashboard/ZoneUtilizationPieChart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/dashboard/DateRangePicker"

export default function Dashboard() {
    // Default to Today ("day" view)
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    })
    const [stats, setStats] = useState({
        totalCrew: 0,
        activeCrews: 0,
        utilizationRate: 0,
        totalZones: 0,
        zoneAllocation: []
    })
    const [activeTab, setActiveTab] = useState("day")

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const params = new URLSearchParams()
                if (date?.from) params.append('startDate', format(date.from, 'yyyy-MM-dd'))
                if (date?.to) params.append('endDate', format(date.to, 'yyyy-MM-dd'))

                const res = await fetch(`${import.meta.env.VITE_API_URL}/daily-logs/stats?${params.toString()}`)
                if (!res.ok) throw new Error('Failed to fetch stats')
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err)
                toast.error("Failed to load dashboard statistics")
            }
        }

        fetchStats()
    }, [date])



    const handleTabChange = (value: string) => {
        const today = new Date()
        setActiveTab(value)

        switch (value) {
            case "day":
                setDate({ from: today, to: today })
                break
            case "week":
                setDate({ from: startOfWeek(today), to: endOfWeek(today) })
                break
            case "month":
                setDate({ from: startOfMonth(today), to: endOfMonth(today) })
                break
            case "year":
                setDate({ from: startOfYear(today), to: endOfYear(today) })
                break
        }
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[300px]">
                        <TabsTrigger value="day" className="rounded-full">Day</TabsTrigger>
                        <TabsTrigger value="week" className="rounded-full">Week</TabsTrigger>
                        <TabsTrigger value="month" className="rounded-full">Month</TabsTrigger>
                        <TabsTrigger value="year" className="rounded-full">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
                {/* ... */}

                <div className="flex items-center gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                </div>
            </div>

            {/* ... Stat Cards ... */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                    title="Total Crew"
                    value={stats.totalCrew}
                />

                <StatCard
                    title="Active Crews"
                    value={stats.activeCrews}
                />

                <StatCard
                    title="Utilization Rate"
                    value={`${stats.utilizationRate}%`}
                />

                <StatCard
                    title="Total Zones"
                    value={stats.totalZones}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4 mb-6">
                <AllocationChart data={stats.zoneAllocation} />
                <ZoneUtilizationPieChart data={stats.zoneAllocation} />
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 mb-6">
                <RevenueLineChart />
            </div>
        </>
    )
}
