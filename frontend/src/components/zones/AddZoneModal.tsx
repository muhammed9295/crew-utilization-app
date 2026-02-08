import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Zone } from "@/types"

interface AddZoneModalProps {
    children: React.ReactNode
    zone?: Zone
    onSave?: () => void
}

export function AddZoneModal({ children, zone, onSave }: AddZoneModalProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("Active")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (zone && open) {
            setName(zone.name)
            setType(zone.type)
            setStatus(zone.status)
        } else if (!zone && open) {
            setName("")
            setType("")
            setStatus("Active")
        }
    }, [zone, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            name,
            type,
            status
        }

        try {
            const url = zone ? `${import.meta.env.VITE_API_URL}/zones/${zone.id}` : `${import.meta.env.VITE_API_URL}/zones`
            const method = zone ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setOpen(false)
                toast.success(zone ? "Zone updated successfully" : "Zone created successfully")
                if (onSave) onSave()

                // Reset form if adding new
                if (!zone) {
                    setName("")
                    setType("")
                    setStatus("Active")
                }
            } else {
                toast.error("Failed to save zone")
                console.error("Failed to save zone")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const title = zone ? "Edit Zone" : "Add New Zone"
    const description = zone ? "Update the details for this zone." : "Enter the details for the new zone here."

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Zone Name</Label>
                        <Input
                            id="name"
                            placeholder="Zone A - North"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select onValueChange={setType} value={type} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Industrial">Industrial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={setStatus} value={status} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#011f5f] hover:bg-[#022a80] min-w-[120px]">
                            {loading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4 text-white" />
                                    Saving...
                                </>
                            ) : (
                                zone ? "Update Zone" : "Save Zone"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
