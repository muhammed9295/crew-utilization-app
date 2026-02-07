import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddCrewModal } from "@/components/crews/AddCrewModal"

interface CrewHeaderProps {
    timeRange: string
    onTimeRangeChange: (value: string) => void
    onCrewAdded: () => void
}

export function CrewHeader({ timeRange, onTimeRangeChange, onCrewAdded }: CrewHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Crew Management</h2>
                <p className="text-muted-foreground">Manage ongoing crews, assignments, and status.</p>
            </div>
            <div className="flex items-center gap-4">
                <Tabs value={timeRange} onValueChange={onTimeRangeChange} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                            value="today"
                            className="rounded-full data-[state=active]:bg-[#011f5f] data-[state=active]:text-white hover:bg-[#ef801f]/10 hover:text-[#ef801f] transition-colors"
                        >
                            Today
                        </TabsTrigger>
                        <TabsTrigger
                            value="week"
                            className="rounded-full data-[state=active]:bg-[#011f5f] data-[state=active]:text-white hover:bg-[#ef801f]/10 hover:text-[#ef801f] transition-colors"
                        >
                            Last Week
                        </TabsTrigger>
                        <TabsTrigger
                            value="month"
                            className="rounded-full data-[state=active]:bg-[#011f5f] data-[state=active]:text-white hover:bg-[#ef801f]/10 hover:text-[#ef801f] transition-colors"
                        >
                            Last Month
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <AddCrewModal onSave={onCrewAdded}>
                    <Button className="bg-[#011f5f] hover:bg-[#022a80]">
                        <Plus className="mr-2 h-4 w-4" /> Add New Crew
                    </Button>
                </AddCrewModal>
            </div>
        </div>
    )
}
