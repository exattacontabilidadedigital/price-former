"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
}

export default function UsersSettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // Invite dialog state
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteData, setInviteData] = useState({ name: "", email: "", role: "USER" })
    const [isInviting, setIsInviting] = useState(false)
    const [tempPassword, setTempPassword] = useState("")

    // Edit dialog state
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editData, setEditData] = useState({ name: "", email: "", role: "USER" })
    const [isEditing, setIsEditing] = useState(false)

    // Delete dialog state
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deletingUser, setDeletingUser] = useState<User | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        } else if (status === "authenticated") {
            fetchUsers()
        }
    }, [status, router])

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/users")

            if (!response.ok) {
                throw new Error("Erro ao buscar usuários")
            }

            const data = await response.json()
            setUsers(data)
        } catch (err) {
            setError("Erro ao carregar lista de usuários")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsInviting(true)

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inviteData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao convidar usuário")
            }

            setTempPassword(data.tempPassword)
            setSuccess(`Usuário convidado! Senha temporária: ${data.tempPassword}`)
            setInviteData({ name: "", email: "", role: "USER" })
            fetchUsers()
            setTimeout(() => setIsInviteOpen(false), 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsInviting(false)
        }
    }

    const handleEditClick = (user: User) => {
        setEditingUser(user)
        setEditData({ name: user.name || "", email: user.email, role: user.role })
        setIsEditOpen(true)
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        setError("")
        setSuccess("")
        setIsEditing(true)

        try {
            const response = await fetch(`/api/users/${editingUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao atualizar usuário")
            }

            setSuccess("Usuário atualizado com sucesso!")
            fetchUsers()
            setTimeout(() => setIsEditOpen(false), 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsEditing(false)
        }
    }

    const handleDeleteClick = (user: User) => {
        setDeletingUser(user)
        setIsDeleteOpen(true)
    }

    const handleDelete = async () => {
        if (!deletingUser) return

        setError("")
        setSuccess("")
        setIsDeleting(true)

        try {
            const response = await fetch(`/api/users/${deletingUser.id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Erro ao excluir usuário")
            }

            setSuccess("Usuário excluído com sucesso!")
            fetchUsers()
            setIsDeleteOpen(false)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const formatRole = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Admin"
            case "USER":
                return "Usuário"
            default:
                return role
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium">Usuários</h3>
                        <p className="text-sm text-muted-foreground">Carregando...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Usuários</h3>
                    <p className="text-sm text-muted-foreground">
                        Gerencie quem tem acesso à sua conta.
                    </p>
                </div>
                <Button onClick={() => setIsInviteOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Convidar Usuário
                </Button>
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
                    <CardTitle>Usuários Ativos</CardTitle>
                    <CardDescription>
                        Lista de usuários com acesso ao sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nenhum usuário encontrado.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {user.name || "Sem nome"}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{formatRole(user.role)}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Invite Dialog */}
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Convidar Usuário</DialogTitle>
                        <DialogDescription>
                            Adicione um novo usuário à sua empresa.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvite}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-name">Nome</Label>
                                <Input
                                    id="invite-name"
                                    value={inviteData.name}
                                    onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-email">Email</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-role">Função</Label>
                                <Select
                                    value={inviteData.role}
                                    onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuário</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isInviting}>
                                {isInviting ? "Convidando..." : "Convidar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Altere as informações do usuário.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome</Label>
                                <Input
                                    id="edit-name"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role">Função</Label>
                                <Select
                                    value={editData.role}
                                    onValueChange={(value) => setEditData({ ...editData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Usuário</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isEditing}>
                                {isEditing ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Usuário</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir {deletingUser?.name || deletingUser?.email}?
                            Esta ação é irreversível.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
