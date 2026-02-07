
export interface Zone {
    id: string;
    name: string;
    type: string;
    status: string;
    totalRevenue?: number;
    utilization?: number;
}

export type CrewRole = "Technician" | "Cleaner";
export type CrewStatus = "Active" | "Inactive" | "On Leave" | "Maintenance";

export interface Crew {
    id: string;
    firstName: string;
    lastName: string;
    role: CrewRole;
    status: CrewStatus;
    dateOfJoining: string; // ISO Date string
    efficiency: number;
    scheduledHours: number;
    zone: Zone;
}

export interface CreateCrewDto {
    firstName: string;
    lastName: string;
    role: string;
    dateOfJoining: string;
    zoneId: string;
    status?: string;
    scheduledHours?: number;
}

export const UserRole = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    EDITOR: 'Editor',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: string;
}
