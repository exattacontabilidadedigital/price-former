"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email é obrigatório"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido"
        }

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória"
        } else if (formData.password.length < 8) {
            newErrors.password = "Senha deve ter no mínimo 8 caracteres"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem"
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "Você deve aceitar os termos de uso"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            // Register user
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setErrors({ general: data.error || 'Erro ao criar conta' })
                setIsLoading(false)
                return
            }

            // Auto-login after successful registration
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setErrors({ general: "Conta criada, mas erro ao fazer login. Tente fazer login manualmente." })
                setIsLoading(false)
            } else {
                // Redirect to dashboard
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            setErrors({ general: "Ocorreu um erro. Tente novamente." })
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
                        <CardTitle className="text-2xl text-center dark:text-white">Criar sua conta</CardTitle>
                        <CardDescription className="text-center dark:text-gray-400">
                            Preencha os dados abaixo para começar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.general && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                                    {errors.general}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="dark:text-gray-300">Nome Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isLoading}
                                    className="dark:bg-input dark:border-input dark:text-white"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoading}
                                    className="dark:bg-input dark:border-input dark:text-white"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="dark:text-gray-300">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirmar Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Digite a senha novamente"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        disabled={isLoading}
                                        className="pr-10 dark:bg-input dark:border-input dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.acceptTerms}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, acceptTerms: checked as boolean })
                                        }
                                        className="mt-1"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-gray-600 dark:text-gray-400 leading-tight cursor-pointer"
                                    >
                                        Eu aceito os{" "}
                                        <Link href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                                            Termos de Uso
                                        </Link>{" "}
                                        e a{" "}
                                        <Link href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                                            Política de Privacidade
                                        </Link>
                                    </label>
                                </div>
                                {errors.acceptTerms && (
                                    <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-600 hover:bg-violet-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Criando conta..." : "Criar Conta"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Já tem uma conta?{" "}
                            </span>
                            <Link
                                href="/login"
                                className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                            >
                                Entrar
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
