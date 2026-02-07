import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeLabel?: string
    trend?: "up" | "down" | "neutral"
    icon?: React.ReactNode
    children?: React.ReactNode
    className?: string
}

// StatCard.tsx
export function StatCard({ title, value, change, changeLabel, trend, icon, children, className }: StatCardProps) {
    const isDark = className?.includes("bg-neutral-900");

    return (
        <Card className={cn("relative overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn("text-sm font-medium", isDark ? "text-neutral-400" : "text-muted-foreground")}>
                    {title}
                </CardTitle>
                {icon}
                {children}
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{value}</div>
                {(change || changeLabel) && (
                    <p className="text-xs flex items-center mt-2">
                        {trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
                        {trend === "down" && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
                        {trend === "neutral" && <Minus className="mr-1 h-3 w-3 text-yellow-500" />}
                        <span
                            className={cn(
                                "font-medium",
                                trend === "up" && "text-green-500",
                                trend === "down" && "text-red-500",
                                trend === "neutral" && "text-yellow-500"
                            )}
                        >
                            {change}
                        </span>
                        <span className="text-muted-foreground ml-1">{changeLabel}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
