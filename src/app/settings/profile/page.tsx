"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface UserData {
    id: string
    name: string | null
    email: string
    role: string
    companyId: string | null
}

export default function ProfileSettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Profile form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    // Password form
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            fetchUserData()
        }
    }, [status, router])

    const fetchUserData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/user/me")

            if (!response.ok) {
                throw new Error("Erro ao buscar dados")
            }

            const data = await response.json()
            setUserData(data)
            setName(data.name || "")
            setEmail(data.email)
        } catch (err) {
            setError("Erro ao carregar dados do perfil")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsSaving(true)

        try {
            const response = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao atualizar")
            }

            setSuccess("Perfil atualizado com sucesso!")
            setUserData(data.user)

            // Update session to reflect the changes in other components (UserNav, etc)
            await update()

            // Force a router refresh to update server components if any
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar perfil")
        } finally {
            setIsSaving(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem")
            return
        }

        if (newPassword.length < 8) {
            setError("A nova senha deve ter no mínimo 8 caracteres")
            return
        }

        setIsChangingPassword(true)

        try {
            const response = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao alterar senha")
            }

            setSuccess("Senha alterada com sucesso!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err: any) {
            setError(err.message || "Erro ao alterar senha")
        } finally {
            setIsChangingPassword(false)
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Perfil</h3>
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Perfil</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie suas informações pessoais e de conta.
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                    {success}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                        Atualize seu nome e endereço de email.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isSaving}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSaving}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Senha</CardTitle>
                    <CardDescription>
                        Altere sua senha de acesso.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha Atual</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={isChangingPassword}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nova Senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isChangingPassword}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isChangingPassword}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" variant="outline" disabled={isChangingPassword}>
                            {isChangingPassword ? "Alterando..." : "Alterar Senha"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
