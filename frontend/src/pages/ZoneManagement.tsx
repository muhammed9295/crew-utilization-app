"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ZoneFilters } from "@/components/zones/ZoneFilters"
import { ZoneTable } from "@/components/zones/ZoneTable"
import { AddZoneModal } from "@/components/zones/AddZoneModal"
import { Spinner } from "@/components/ui/spinner"
import type { Zone, Crew } from "@/types"

export default function ZoneManagement() {
    const [zones, setZones] = useState<Zone[]>([])
    const [crews, setCrews] = useState<Crew[]>([])
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    const fetchData = useCallback(async () => {
        try {
            const [zonesRes, crewsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/zones`),
                fetch(`${import.meta.env.VITE_API_URL}/crews`)
            ])

            const zonesData = await zonesRes.json()
            const crewsData = await crewsRes.json()

            setZones(zonesData)
            setCrews(crewsData)
        } catch (error) {
            console.error("Failed to fetch zone data", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const filteredZones = zones.filter(zone => {
        const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || zone.status.toLowerCase() === statusFilter.toLowerCase()
        const matchesType = typeFilter === "all" || zone.type.toLowerCase() === typeFilter.toLowerCase()

        return matchesSearch && matchesStatus && matchesType
    })

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Zone Management</h2>
                    <p className="text-muted-foreground">Manage operational zones and their status.</p>
                </div>
                <div className="flex items-center gap-4">
                    <AddZoneModal onSave={fetchData}>
                        <Button className="bg-[#011f5f] hover:bg-[#022a80]">
                            <Plus className="mr-2 h-4 w-4" /> Add New Zone
                        </Button>
                    </AddZoneModal>
                </div>
            </div>

            {/* <ZoneStats zones={zones} crews={crews} /> */}

            <ZoneFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            <ZoneTable
                zones={filteredZones}
                crews={crews}
                onZoneUpdated={fetchData}
            />
        </div>
    )
}
