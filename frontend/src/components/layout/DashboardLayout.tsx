import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            <Sidebar className="hidden lg:flex flex-shrink-0" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
