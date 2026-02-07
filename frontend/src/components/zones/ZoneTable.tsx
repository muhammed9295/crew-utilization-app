import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Zone, Crew } from "@/types"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AddZoneModal } from "@/components/zones/AddZoneModal"

interface ZoneTableProps {
    zones: Zone[]
    crews: Crew[]
    onZoneUpdated?: () => void
}

export function ZoneTable({ zones, crews, onZoneUpdated }: ZoneTableProps) {
    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:3000/zones/${id}`, {
                method: 'DELETE'
            })
            toast.success("Zone deleted successfully")
            if (onZoneUpdated) onZoneUpdated()
        } catch (error) {
            toast.error("Failed to delete zone")
            console.error("Failed to delete zone", error)
        }
    }

    const getZoneMetrics = (zone: Zone) => {
        const zoneCrews = crews.filter(crew => crew.zone?.id === zone.id)
        const totalCrews = zoneCrews.length
        return {
            totalCrews,
            totalUtilization: zone.utilization || 0,
            revenue: zone.totalRevenue || 0
        }
    }

    return (
        <Card>
            <CardContent className="p-0 max-h-[600px] overflow-auto relative">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                        <TableRow>
                            <TableHead className="py-4 px-4 bg-muted/50">ZONE NAME</TableHead>
                            <TableHead className="text-center py-4 px-4 bg-muted/50">TOTAL CREWS</TableHead>
                            <TableHead className="text-center py-4 px-4 bg-muted/50">TOTAL UTILIZATION</TableHead>
                            <TableHead className="py-4 px-4 bg-muted/50">STATUS</TableHead>
                            <TableHead className="text-right py-4 px-4 bg-muted/50">TOTAL REVENUE</TableHead>
                            <TableHead className="w-[50px] py-4 px-4 bg-muted/50"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {zones.map((zone) => {
                            const { totalCrews, totalUtilization, revenue } = getZoneMetrics(zone)
                            return (
                                <TableRow key={zone.id} className="hover:bg-muted/5">
                                    <TableCell className="font-semibold py-4 px-4">{zone.name}</TableCell>
                                    <TableCell className="text-center py-4 px-4">{totalCrews}</TableCell>
                                    <TableCell className="text-center py-4 px-4">
                                        {totalCrews > 0 ? (
                                            <span className={totalUtilization >= 90 ? "text-green-600 font-bold" : "text-neutral-600"}>
                                                {totalUtilization}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-4 px-4">
                                        <Badge
                                            variant="secondary"
                                            className={`font-normal ${zone.status === "Active"
                                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                                                }`}
                                        >
                                            {zone.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-4 px-4 font-medium">
                                        SAR {revenue.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-4 px-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <AddZoneModal zone={zone} onSave={onZoneUpdated}>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        Edit
                                                    </DropdownMenuItem>
                                                </AddZoneModal>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the zone
                                                                and remove its data from the servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(zone.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
