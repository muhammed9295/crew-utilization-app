import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { menuItems } from "./Sidebar"

export function Header() {
    const location = useLocation()
    const { user } = useAuth()

    const getPageTitle = (pathname: string) => {
        const menuItem = menuItems.find(item => item.href === pathname)
        return menuItem ? menuItem.label : "Dashboard"
    }

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white dark:bg-neutral-950 px-6 py-4">
            <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    {getPageTitle(location.pathname)}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                    {new Date().toDateString()}
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* User profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user?.role || "Guest"}</p>
                    </div>
                    <Avatar>
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
