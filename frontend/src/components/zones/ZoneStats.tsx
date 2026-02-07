import { StatCard } from "@/components/shared/StatCard"
import { MapPin, Percent, DollarSign } from "lucide-react"
import type { Zone, Crew } from "@/types"

interface ZoneStatsProps {
    zones: Zone[]
    crews: Crew[]
}

export function ZoneStats({ zones, crews }: ZoneStatsProps) {
    const totalUtilization = crews.length > 0
        ? Math.round(crews.reduce((acc, crew) => acc + crew.efficiency, 0) / crews.length)
        : 0

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard
                title="Total Zones"
                value={zones.length.toString()}
                className=""
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
                title="Total Utilization"
                value={`${totalUtilization}%`}
                className=""
                icon={<Percent className="h-4 w-4 text-blue-500" />}
            />
            <StatCard
                title="Total Revenue"
                value="SAR 125,000"
                className=""
                icon={<DollarSign className="h-4 w-4 text-green-500" />}
            />
        </div>
    )
}
