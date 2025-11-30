"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">Novo produto cadastrado</span>
                            <span className="text-xs text-gray-500">2m atrás</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">O produto "Smartphone X" foi adicionado com sucesso.</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-sm">Meta de lucro atingida</span>
                            <span className="text-xs text-gray-500">1h atrás</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Parabéns! A meta de lucro mensal foi alcançada.</p>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full text-center cursor-pointer justify-center text-violet-600 font-medium">
                    Ver todas as notificações
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
