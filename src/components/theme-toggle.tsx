"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="h-[1.1rem] w-[1.1rem]" />
                <span className="sr-only">Loading theme...</span>
            </Button>
        )
    }

    const isDark = resolvedTheme === "dark"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="theme-toggle relative hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
        >
            <Sun className={`h-[1.1rem] w-[1.1rem] transition-all duration-300 ease-in-out ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <Moon className={`absolute h-[1.1rem] w-[1.1rem] transition-all duration-300 ease-in-out ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
