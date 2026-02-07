import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: {
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof NextThemesProvider>, 'children'>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
