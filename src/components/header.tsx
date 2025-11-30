"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { NotificationsNav } from "@/components/notifications-nav"
import { CheckSquare, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6 shadow-sm calculator-card">
            <div className="flex flex-1 items-center justify-end gap-4">
                <Button variant="ghost" size="icon" className="relative hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <CheckSquare className="h-5 w-5" />
                    <span className="sr-only">Tasks</span>
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                </Button>
                <Button variant="ghost" size="icon" className="relative hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span className="sr-only">Chat</span>
                </Button>
                <ThemeToggle />
                <NotificationsNav />
                <UserNav />
            </div>
        </header>
    )
}
