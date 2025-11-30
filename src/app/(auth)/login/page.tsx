"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Email ou senha inválidos")
                setIsLoading(false)
            } else {
                // Redirect to dashboard on successful login
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (error) {
            setError("Ocorreu um erro. Tente novamente.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-10 w-10 bg-violet-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold">PF</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Price Former</span>
                </div>

                <Card className="dark:bg-card dark:border-border">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center dark:text-white">Entrar na sua conta</CardTitle>
                        <CardDescription className="text-center dark:text-gray-400">
                            Digite seu email e senha para acessar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="dark:bg-input dark:border-input dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="dark:text-gray-300">Senha</Label>
                                    <Link
                                        href="#"
                                        className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pr-10 dark:bg-input dark:border-input dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-600 hover:bg-violet-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Não tem uma conta?{" "}
                            </span>
                            <Link
                                href="/register"
                                className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                            >
                                Criar conta
                            </Link>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t dark:border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-card text-gray-500 dark:text-gray-400">
                                        Ou voltar para
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link href="/landing">
                                    <Button variant="outline" className="w-full dark:border-border dark:text-white dark:hover:bg-muted">
                                        Página Inicial
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
