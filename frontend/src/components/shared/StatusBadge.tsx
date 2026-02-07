import { Badge } from "@/components/ui/badge"

type StatusType = "Completed" | "In Progress" | "Scheduled"

interface StatusBadgeProps {
    status: StatusType | string
}

export function StatusBadge({ status }: StatusBadgeProps) {
    let variantClass = ""

    switch (status) {
        case "Completed":
            variantClass = "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
            break
        case "In Progress":
            variantClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
            break
        case "Scheduled":
            variantClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            break
        default:
            variantClass = "bg-gray-100 text-gray-700"
    }

    return (
        <Badge variant="secondary" className={variantClass}>
            {status}
        </Badge>
    )
}
