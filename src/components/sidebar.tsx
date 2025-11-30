"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Tag, ShoppingCart, DollarSign, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Precificação",
        icon: Tag,
        href: "/calculator",
    },
    {
        label: "Cadastro de Produtos",
        icon: ShoppingCart,
        href: "/products",
    },
    {
        label: "Custos e Impostos",
        icon: DollarSign,
        href: "/costs",
    },
    {
        label: "Relatórios",
        icon: BarChart3,
        href: "/reports",
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const [companyName, setCompanyName] = useState(session?.user?.company?.fantasyName || session?.user?.company?.name || "Empresa")
    const [companyCnpj, setCompanyCnpj] = useState(session?.user?.company?.cnpj || "")
    const [logoUrl, setLogoUrl] = useState(session?.user?.company?.logoUrl || null)

    useEffect(() => {
        if (session?.user) {
            // Initialize with session data if available
            if (session.user.company) {
                setCompanyName(session.user.company.fantasyName || session.user.company.name)
                setCompanyCnpj(session.user.company.cnpj || "")
                setLogoUrl(session.user.company.logoUrl || null)
            }

            // Fetch fresh data to ensure we have the latest company info
            fetch("/api/company")
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) {
                        setCompanyName(data.fantasyName || data.name || "Empresa")
                        if (data.cnpj) setCompanyCnpj(data.cnpj)
                        if (data.logoUrl) setLogoUrl(data.logoUrl)
                    }
                })
                .catch(err => console.error("Failed to fetch company data", err))
        }
    }, [session])

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r border-border calculator-card">
            <div className="px-3 py-2 flex-1">
                <div className="flex items-center pl-3 mb-14 calculator-animate-in">
                    <div className="h-10 w-10 bg-muted rounded-lg mr-3 overflow-hidden flex items-center justify-center border border-border">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo"
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs font-bold text-muted-foreground">LOGO</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="calculator-title text-xs font-bold text-foreground truncate">
                            {companyName}
                        </h1>
                        <p className="text-xs text-muted-foreground truncate">{companyCnpj}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200 sidebar-nav-item",
                                pathname === route.href 
                                    ? "!bg-violet-600 !text-white shadow-sm active" 
                                    : "!text-gray-700 dark:!text-gray-700 hover:!bg-transparent hover:!text-violet-600 dark:hover:!text-violet-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn(
                                    "h-5 w-5 mr-3 transition-colors duration-200",
                                    pathname === route.href 
                                        ? "!text-white" 
                                        : "!text-gray-700 dark:!text-gray-700 group-hover:!text-violet-600 dark:group-hover:!text-violet-400"
                                )} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="space-y-1">
                    {/* Footer links removed as requested */}
                </div>
            </div>
        </div>
    )
}
