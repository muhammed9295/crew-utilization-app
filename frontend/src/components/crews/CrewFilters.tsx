import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Zone } from "@/types"

interface CrewFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusChange: (value: string) => void
    roleFilter: string
    onRoleChange: (value: string) => void
    zoneFilter: string
    onZoneChange: (value: string) => void
    zones: Zone[]
}

export function CrewFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    roleFilter,
    onRoleChange,
    zoneFilter,
    onZoneChange,
    zones
}: CrewFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-2 w-full flex-wrap justify-end">
                <div className="relative w-full md:w-auto md:min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search crews..."
                        className="pl-8 bg-white dark:bg-neutral-950"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-950">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on leave">On Leave</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={onRoleChange}>
                    <SelectTrigger className="w-[140px] bg-white dark:bg-neutral-950">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                    </SelectContent>
                </Select>

                {/* Zone Filter */}
                <Select value={zoneFilter} onValueChange={onZoneChange}>
                    <SelectTrigger className="w-[160px] bg-white dark:bg-neutral-950">
                        <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        {zones.map((zone) => (
                            <SelectItem key={zone.id} value={zone.name}>
                                {zone.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
