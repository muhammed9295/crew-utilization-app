
import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Map, LogOut, ClipboardList, Shield } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { UserRole } from "@/types"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

interface MenuItem {
    label: string
    icon: React.ElementType
    href: string
    role?: UserRole
}

export const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
    },
    {
        label: "Crews",
        icon: Users,
        href: "/crews",
    },
    {
        label: "Zones",
        icon: Map,
        href: "/zones",
    },
    {
        label: "Daily Log Entry",
        icon: ClipboardList,
        href: "/daily-log",
    },
    {
        label: "All Log Entries",
        icon: ClipboardList,
        href: "/all-logs",
    },
    {
        label: "Users",
        icon: Shield,
        href: "/users",
        role: UserRole.SUPER_ADMIN
    }
]

import logo from "@/assets/logo.png"

export function Sidebar({ className }: SidebarProps) {
    const { user, logout } = useAuth();

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-white dark:bg-neutral-950 w-56 flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-6 py-2 flex items-center justify-start">
                    <img src={logo} alt="MServe" className="h-12 w-auto" />
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            if (item.role && user?.role !== item.role) return null;

                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={({ isActive }) => cn(
                                        "flex items-center w-full px-4 py-3 text-base font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400"
                                            : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="px-3 py-4 mt-auto border-t">
                {user && (
                    <div className="px-4 py-2 mb-2 text-sm text-neutral-500">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{user.name}</p>
                        <p className="text-xs">{user.role}</p>
                    </div>
                )}
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    )
}
