import { StatCard } from "@/components/shared/StatCard"
import { Users, HardHat, Clock } from "lucide-react"
import type { Crew } from "@/types"

interface CrewStatsProps {
    crews: Crew[]
}

export function CrewStats({ crews }: CrewStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <StatCard
                title="Total Crews"
                value={crews.length.toString()}
                className=""
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatCard
                title="Active Crews"
                value={crews.filter(c => c.status === "Active").length.toString()}
                className=""
                icon={<HardHat className="h-4 w-4 text-green-500" />}
            />
            <StatCard
                title="On Leave"
                value={crews.filter(c => c.status === "On Leave").length.toString()}
                className=""
                icon={<Clock className="h-4 w-4 text-blue-500" />}
            />
        </div>
    )
}
