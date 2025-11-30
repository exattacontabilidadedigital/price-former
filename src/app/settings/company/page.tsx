"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface CompanyData {
    id: string
    name: string
    fantasyName: string | null
    cnpj: string | null
    address: string | null
    logoUrl: string | null
}

export default function CompanySettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [companyData, setCompanyData] = useState<CompanyData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [noCompany, setNoCompany] = useState(false)

    const [name, setName] = useState("")
    const [fantasyName, setFantasyName] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [address, setAddress] = useState("")
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            fetchCompanyData()
        }
    }, [status, router])

    const fetchCompanyData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/company")

            if (response.status === 404) {
                setNoCompany(true)
                setIsLoading(false)
                return
            }

            if (!response.ok) {
                throw new Error("Erro ao buscar dados")
            }

            const data = await response.json()
            setCompanyData(data)
            setName(data.name || "")
            setFantasyName(data.fantasyName || "")
            setCnpj(data.cnpj || "")
            setAddress(data.address || "")
            setLogoUrl(data.logoUrl || null)
        } catch (err) {
            setError("Erro ao carregar dados da empresa")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateCompany = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsSaving(true)

        try {
            const response = await fetch("/api/company", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, fantasyName, cnpj, address }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao atualizar")
            }

            setSuccess("Empresa atualizada com sucesso!")
            setCompanyData(data.company)

            // Update session to reflect the changes in other components (Sidebar, etc)
            await update()
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar empresa")
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError("")

        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/company/logo", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao fazer upload da logo")
            }

            setLogoUrl(data.logoUrl)
            setSuccess("Logo atualizada com sucesso!")
            await update()
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Erro ao fazer upload da logo")
        } finally {
            setIsUploading(false)
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Configurações da Empresa</h3>
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    if (noCompany) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Configurações da Empresa</h3>
                    <p className="text-sm text-muted-foreground">
                        Gerencie os dados da sua organização.
                    </p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                            Você não possui uma empresa associada à sua conta.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configurações da Empresa</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie os dados da sua organização.
                </p>
            </div>

            {error && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 text-sm text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded" style={{backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderColor: 'rgba(22, 163, 74, 0.3)'}}>
                    {success}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Logo da Empresa</CardTitle>
                    <CardDescription>
                        Faça upload da logo da sua empresa para exibir nos relatórios e menu.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border" style={{backgroundColor: '#fafafa'}}>
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo da Empresa" className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">Sem Logo</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Button 
                                type="button" 
                                disabled={isUploading} 
                                className="bg-violet-600 hover:bg-violet-700 text-white"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                                {isUploading ? "Enviando..." : "Escolher Imagem"}
                            </Button>
                            <Input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                                disabled={isUploading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Recomendado: PNG ou JPG, máx 2MB.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <CardDescription>
                        Informações visíveis em relatórios e documentos.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateCompany}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Razão Social</Label>
                                <Input
                                    id="company-name"
                                    placeholder="Razão Social da empresa"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isSaving}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fantasy-name">Nome Fantasia</Label>
                                <Input
                                    id="fantasy-name"
                                    placeholder="Nome Fantasia"
                                    value={fantasyName}
                                    onChange={(e) => setFantasyName(e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                placeholder="00.000.000/0000-00"
                                value={cnpj}
                                onChange={(e) => setCnpj(e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                                id="address"
                                placeholder="Endereço completo"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={isSaving}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4">
                        <Button type="submit" disabled={isSaving} className="bg-violet-600 hover:bg-violet-700 text-white">
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
