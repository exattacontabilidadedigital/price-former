"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Tag, ShoppingCart, DollarSign, BarChart3, Calculator, List, ChevronDown, ChevronRight } from "lucide-react"
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
        subRoutes: [
            {
                label: "Calculadora",
                icon: Calculator,
                href: "/calculator",
            },
            {
                label: "Listagem",
                icon: List,
                href: "/calculator/listagem",
            },
        ]
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
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

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

    // Auto-expand menu if current path is in submenu
    useEffect(() => {
        routes.forEach(route => {
            if (route.subRoutes) {
                const isInSubRoute = route.subRoutes.some(subRoute => pathname === subRoute.href)
                if (isInSubRoute && !expandedMenus.includes(route.label)) {
                    setExpandedMenus(prev => [...prev, route.label])
                }
            }
        })
    }, [pathname])

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev => 
            prev.includes(label) 
                ? prev.filter(item => item !== label)
                : [...prev, label]
        )
    }

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
                        <div key={route.href}>
                            {route.subRoutes ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(route.label)}
                                        className={cn(
                                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200 sidebar-nav-item",
                                            pathname.startsWith(route.href) 
                                                ? "!bg-violet-600 !text-white shadow-sm active" 
                                                : "!text-gray-700 dark:!text-gray-700 hover:!bg-transparent hover:!text-violet-600 dark:hover:!text-violet-400"
                                        )}
                                    >
                                        <div className="flex items-center flex-1">
                                            <route.icon className={cn(
                                                "h-5 w-5 mr-3 transition-colors duration-200",
                                                pathname.startsWith(route.href) 
                                                    ? "!text-white" 
                                                    : "!text-gray-700 dark:!text-gray-700 group-hover:!text-violet-600 dark:group-hover:!text-violet-400"
                                            )} />
                                            {route.label}
                                        </div>
                                        {expandedMenus.includes(route.label) ? (
                                            <ChevronDown className={cn(
                                                "h-4 w-4 transition-colors duration-200",
                                                pathname.startsWith(route.href) 
                                                    ? "!text-white" 
                                                    : "!text-gray-700 dark:!text-gray-700 group-hover:!text-violet-600 dark:group-hover:!text-violet-400"
                                            )} />
                                        ) : (
                                            <ChevronRight className={cn(
                                                "h-4 w-4 transition-colors duration-200",
                                                pathname.startsWith(route.href) 
                                                    ? "!text-white" 
                                                    : "!text-gray-700 dark:!text-gray-700 group-hover:!text-violet-600 dark:group-hover:!text-violet-400"
                                            )} />
                                        )}
                                    </button>
                                    {expandedMenus.includes(route.label) && (
                                        <div className="ml-8 mt-1 space-y-1">
                                            {route.subRoutes.map((subRoute) => (
                                                <Link
                                                    key={subRoute.href}
                                                    href={subRoute.href}
                                                    className={cn(
                                                        "text-sm group flex p-2 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200 sidebar-nav-item",
                                                        pathname === subRoute.href 
                                                            ? "!bg-violet-500 !text-white shadow-sm active" 
                                                            : "!text-gray-600 dark:!text-gray-600 hover:!bg-transparent hover:!text-violet-600 dark:hover:!text-violet-400"
                                                    )}
                                                >
                                                    <div className="flex items-center flex-1">
                                                        <subRoute.icon className={cn(
                                                            "h-4 w-4 mr-3 transition-colors duration-200",
                                                            pathname === subRoute.href 
                                                                ? "!text-white" 
                                                                : "!text-gray-600 dark:!text-gray-600 group-hover:!text-violet-600 dark:group-hover:!text-violet-400"
                                                        )} />
                                                        {subRoute.label}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
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
                            )}
                        </div>
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
