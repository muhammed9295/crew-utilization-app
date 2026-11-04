"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
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
import { DatePicker } from "@/components/ui/date-picker"

import type { Crew, Zone } from "@/types"

interface AddCrewModalProps {
    children: React.ReactNode
    crew?: Crew
    onSave?: () => void
}

const DEFAULT_ROLES = ["Technician", "Cleaner", "Car Washer"]
const CUSTOM_ROLES_STORAGE_KEY = "crew_custom_roles"

export function AddCrewModal({ children, crew, onSave }: AddCrewModalProps) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [role, setRole] = useState("")
    const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES)
    const [isAddingRole, setIsAddingRole] = useState(false)
    const [newRoleName, setNewRoleName] = useState("")
    const [date, setDate] = useState<Date>()
    const [zoneId, setZoneId] = useState("")
    const [status, setStatus] = useState("Active")
    const [scheduledHours, setScheduledHours] = useState("8")
    const [open, setOpen] = useState(false)
    const [zones, setZones] = useState<Zone[]>([])
    const [loading, setLoading] = useState(false)

    // Load saved custom roles
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CUSTOM_ROLES_STORAGE_KEY)
            if (saved) {
                const parsed: string[] = JSON.parse(saved)
                setRoles(Array.from(new Set([...DEFAULT_ROLES, ...parsed])))
            }
        } catch (e) {
            console.error("Failed to load custom roles", e)
        }
    }, [open])

    // Fetch Zones
    useEffect(() => {
        if (open) {
            fetch(`${import.meta.env.VITE_API_URL}/zones`)
                .then(res => res.json())
                .then(data => setZones(data))
                .catch(err => console.error("Failed to fetch zones", err))
        }
    }, [open])

    // Populate Form
    useEffect(() => {
        if (crew && open) {
            setFirstName(crew.firstName)
            setLastName(crew.lastName)
            setRole(crew.role)
            if (crew.role) {
                setRoles(prev => Array.from(new Set([...prev, crew.role])))
            }
            try {
                setDate(new Date(crew.dateOfJoining))
            } catch (e) {
                console.error("Invalid date", e)
            }
            setZoneId(crew.zone?.id || "")
            setStatus(crew.status)
            setScheduledHours(String(crew.scheduledHours || "8"))
            setIsAddingRole(false)
            setNewRoleName("")
        } else if (!crew && open) {
            setFirstName("")
            setLastName("")
            setRole("")
            setDate(undefined)
            setZoneId("")
            setStatus("Active")
            setScheduledHours("8")
            setIsAddingRole(false)
            setNewRoleName("")
        }
    }, [crew, open])

    const handleRoleSelectChange = (value: string) => {
        if (value === "__add_more_role__") {
            setIsAddingRole(true)
        } else {
            setRole(value)
            setIsAddingRole(false)
        }
    }

    const handleSaveNewRole = () => {
        const trimmed = newRoleName.trim()
        if (!trimmed) return

        const updatedRoles = Array.from(new Set([...roles, trimmed]))
        setRoles(updatedRoles)
        setRole(trimmed)
        setNewRoleName("")
        setIsAddingRole(false)

        try {
            const customRoles = updatedRoles.filter(r => !DEFAULT_ROLES.includes(r))
            localStorage.setItem(CUSTOM_ROLES_STORAGE_KEY, JSON.stringify(customRoles))
        } catch (e) {
            console.error("Failed to save custom role", e)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !zoneId) return;

        setLoading(true)
        const payload = {
            firstName,
            lastName,
            role,
            dateOfJoining: format(date, 'yyyy-MM-dd'),
            zoneId,
            status,
            scheduledHours: parseFloat(scheduledHours) || 0
        }

        try {
            const url = crew ? `${import.meta.env.VITE_API_URL}/crews/${crew.id}` : `${import.meta.env.VITE_API_URL}/crews`
            const method = crew ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setOpen(false)
                if (onSave) onSave()
            } else {
                console.error("Failed to save crew")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const title = crew ? "Edit Crew" : "Add New Crew"
    const description = crew ? "Update the details for this crew member." : "Enter the details for the new crew member here."

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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={handleRoleSelectChange} value={role} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                                <SelectItem value="__add_more_role__" className="text-[#011f5f] font-medium">
                                    + Add More Role
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {isAddingRole && (
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    placeholder="Enter new role"
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleSaveNewRole()
                                        }
                                    }}
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    onClick={handleSaveNewRole}
                                    className="bg-[#011f5f] hover:bg-[#022a80] shrink-0"
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label>Date of Joining</Label>
                        <DatePicker date={date} setDate={setDate} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="zone">Zone</Label>
                        <Select onValueChange={setZoneId} value={zoneId} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select zone" />
                            </SelectTrigger>
                            <SelectContent>
                                {zones.map((z) => (
                                    <SelectItem key={z.id} value={z.id}>
                                        {z.name}
                                    </SelectItem>
                                ))}
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
                                <SelectItem value="On Leave">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="scheduledHours">Scheduled Hours (Daily)</Label>
                        <Input
                            id="scheduledHours"
                            type="number"
                            placeholder="8"
                            min="0"
                            step="0.5"
                            value={scheduledHours}
                            onChange={(e) => setScheduledHours(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#011f5f] hover:bg-[#022a80] min-w-[120px]">
                            {loading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4 text-white" />
                                    Saving...
                                </>
                            ) : (
                                crew ? "Update Crew" : "Save Crew"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
