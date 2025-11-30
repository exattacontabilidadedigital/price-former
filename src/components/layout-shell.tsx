"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const publicRoutes = ['/login', '/register', '/landing']
    const isPublicRoute = pathname === '/' || publicRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
        return (
            <div className="min-h-screen">
                {children}
                <Toaster />
            </div>
        )
    }

    return (
        <div className="flex h-full min-h-screen bg-background">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10 w-full bg-background">
                <Header />
                <div className="px-4 py-6 md:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    )
}
