"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    getExpenses, createExpense, updateExpense, deleteExpense,
    getRevenues, createRevenue, updateRevenue, deleteRevenue,
    getTaxes, createTax, updateTax, deleteTax
} from "@/app/actions/cost-actions"

interface Expense {
    id: string
    description: string
    value: number
    type: string
}

interface Revenue {
    id: string
    value: number
    period: string
    date: Date
}

interface Tax {
    id: string
    name: string
    rate: number
    type: string
}

export default function CostsPage() {
    // State
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [revenues, setRevenues] = useState<Revenue[]>([])
    const [taxes, setTaxes] = useState<Tax[]>([])

    // Modals
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false)
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)

    // Editing State
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null)
    const [editingTax, setEditingTax] = useState<Tax | null>(null)

    // Forms
    const [expenseDesc, setExpenseDesc] = useState("")
    const [expenseVal, setExpenseVal] = useState("")
    const [expenseType, setExpenseType] = useState("")

    const [revenueVal, setRevenueVal] = useState("")
    const [revenuePeriod, setRevenuePeriod] = useState("")

    const [taxName, setTaxName] = useState("")
    const [taxRate, setTaxRate] = useState("")
    const [taxType, setTaxType] = useState("")

    const fetchData = async () => {
        const [e, r, t] = await Promise.all([getExpenses(), getRevenues(), getTaxes()])
        setExpenses(e)
        setRevenues(r)
        setTaxes(t)
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --- Expenses Handlers ---
    const handleOpenExpenseModal = (expense?: Expense) => {
        if (expense) {
            setEditingExpense(expense)
            setExpenseDesc(expense.description)
            setExpenseVal(expense.value.toString())
            setExpenseType(expense.type)
        } else {
            setEditingExpense(null)
            setExpenseDesc("")
            setExpenseVal("")
            setExpenseType("")
        }
        setIsExpenseModalOpen(true)
    }

    const handleSaveExpense = async () => {
        if (!expenseDesc || !expenseVal || !expenseType) return

        const data = {
            description: expenseDesc,
            value: parseFloat(expenseVal),
            type: expenseType
        }

        if (editingExpense) {
            await updateExpense(editingExpense.id, data)
        } else {
            await createExpense(data)
        }

        setExpenseDesc("")
        setExpenseVal("")
        setExpenseType("")
        setIsExpenseModalOpen(false)
        setEditingExpense(null)
        fetchData()
    }

    const handleDeleteExpense = async (id: string) => {
        if (confirm("Excluir despesa?")) {
            await deleteExpense(id)
            fetchData()
        }
    }

    // --- Revenue Handlers ---
    const handleOpenRevenueModal = (revenue?: Revenue) => {
        if (revenue) {
            setEditingRevenue(revenue)
            setRevenueVal(revenue.value.toString())
            setRevenuePeriod(revenue.period)
        } else {
            setEditingRevenue(null)
            setRevenueVal("")
            setRevenuePeriod("")
        }
        setIsRevenueModalOpen(true)
    }

    const handleSaveRevenue = async () => {
        if (!revenueVal || !revenuePeriod) return

        const data = {
            value: parseFloat(revenueVal),
            period: revenuePeriod
        }

        if (editingRevenue) {
            await updateRevenue(editingRevenue.id, data)
        } else {
            await createRevenue(data)
        }

        setRevenueVal("")
        setRevenuePeriod("")
        setIsRevenueModalOpen(false)
        setEditingRevenue(null)
        fetchData()
    }

    const handleDeleteRevenue = async (id: string) => {
        if (confirm("Excluir faturamento?")) {
            await deleteRevenue(id)
            fetchData()
        }
    }

    // --- Tax Handlers ---
    const handleOpenTaxModal = (tax?: Tax) => {
        if (tax) {
            setEditingTax(tax)
            setTaxName(tax.name)
            setTaxRate(tax.rate.toString())
            setTaxType(tax.type || "OTHERS")
        } else {
            setEditingTax(null)
            setTaxName("")
            setTaxRate("")
            setTaxType("")
        }
        setIsTaxModalOpen(true)
    }

    const handleSaveTax = async () => {
        if (!taxName || !taxRate || !taxType) return

        const data = {
            name: taxName,
            rate: parseFloat(taxRate),
            type: taxType
        }

        if (editingTax) {
            await updateTax(editingTax.id, data)
        } else {
            await createTax(data)
        }

        setTaxName("")
        setTaxRate("")
        setTaxType("")
        setIsTaxModalOpen(false)
        setEditingTax(null)
        fetchData()
    }

    const handleDeleteTax = async (id: string) => {
        if (confirm("Excluir imposto?")) {
            await deleteTax(id)
            fetchData()
        }
    }

    // Calculations
    const totalFixedExpenses = expenses
        .filter(e => e.type === 'fixed')
        .reduce((acc, curr) => acc + curr.value, 0)

    const totalVariableExpenses = expenses
        .filter(e => e.type === 'variable')
        .reduce((acc, curr) => acc + curr.value, 0)

    const totalRevenueMonthly = revenues
        .filter(r => r.period === 'monthly')
        .reduce((acc, curr) => acc + curr.value, 0)

    const totalRevenueAnnual = revenues
        .filter(r => r.period === 'annual')
        .reduce((acc, curr) => acc + curr.value, 0)

    // Calculate expense percentages
    const fixedExpensePercentage = totalRevenueMonthly > 0
        ? (totalFixedExpenses / totalRevenueMonthly) * 100
        : 0

    const variableExpensePercentage = totalRevenueMonthly > 0
        ? (totalVariableExpenses / totalRevenueMonthly) * 100
        : 0

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Configuração de Custos</h2>
                <p className="text-gray-500 dark:text-gray-400">Gerencie as despesas, faturamento e impostos para calcular seu preço de venda.</p>
            </div>

            <Tabs defaultValue="expenses" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="expenses">Despesas</TabsTrigger>
                    <TabsTrigger value="revenue">Faturamento</TabsTrigger>
                    <TabsTrigger value="taxes">Impostos</TabsTrigger>
                </TabsList>

                {/* --- EXPENSES TAB --- */}
                <TabsContent value="expenses" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="dark:bg-card dark:border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium card-title-black">Total Despesas Fixas (Mensal)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold main-value-black">
                                    R$ {totalFixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {fixedExpensePercentage.toFixed(2)}% do faturamento mensal
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="dark:bg-card dark:border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium card-title-black">Total Despesas Variáveis (Mensal)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold main-value-black">
                                    R$ {totalVariableExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {variableExpensePercentage.toFixed(2)}% do faturamento mensal
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Despesas Fixas e Variáveis</h3>
                            <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenExpenseModal()} className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Nova Despesa
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="dark:bg-card dark:border-border">
                                    <DialogHeader>
                                        <DialogTitle className="dark:text-white">{editingExpense ? "Editar Despesa" : "Adicionar Nova Despesa"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="desc" className="dark:text-gray-300">Descrição</Label>
                                            <Input
                                                id="desc"
                                                placeholder="Ex: Aluguel"
                                                className="dark:bg-input dark:border-input dark:text-white"
                                                value={expenseDesc}
                                                onChange={e => setExpenseDesc(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="val" className="dark:text-gray-300">Valor</Label>
                                                <Input
                                                    id="val"
                                                    placeholder="R$ 0,00"
                                                    type="number"
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                    value={expenseVal}
                                                    onChange={e => setExpenseVal(e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="type" className="dark:text-gray-300">Tipo</Label>
                                                <Select value={expenseType} onValueChange={setExpenseType}>
                                                    <SelectTrigger className="dark:bg-input dark:border-input dark:text-white">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-card dark:border-border">
                                                        <SelectItem value="fixed" className="dark:text-gray-300 dark:focus:bg-muted">Fixo</SelectItem>
                                                        <SelectItem value="variable" className="dark:text-gray-300 dark:focus:bg-muted">Variável</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button onClick={handleSaveExpense} className="bg-violet-600 hover:bg-violet-700 w-full mt-2 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                            {editingExpense ? "Atualizar Despesa" : "Salvar Despesa"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="rounded-md border bg-white dark:bg-card dark:border-border overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow className="dark:border-border">
                                        <TableHead className="dark:text-gray-400">DESCRIÇÃO</TableHead>
                                        <TableHead className="dark:text-gray-400">VALOR</TableHead>
                                        <TableHead className="dark:text-gray-400">TIPO</TableHead>
                                        <TableHead className="text-right dark:text-gray-400">AÇÕES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map(expense => (
                                        <TableRow key={expense.id} className="dark:border-border">
                                            <TableCell className="dark:text-gray-300">{expense.description}</TableCell>
                                            <TableCell className="dark:text-gray-300">
                                                R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${expense.type === 'fixed'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                                    }`}>
                                                    {expense.type === 'fixed' ? 'Fixo' : 'Variável'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenExpenseModal(expense)} className="dark:hover:bg-muted">
                                                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)} className="dark:hover:bg-muted">
                                                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* --- REVENUE TAB --- */}
                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="dark:bg-card dark:border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium card-title-black">Faturamento (Mensal)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold main-value-black">
                                    R$ {totalRevenueMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="dark:bg-card dark:border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium card-title-black">Faturamento (Anual)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold main-value-black">
                                    R$ {totalRevenueAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Estimativas de Faturamento</h3>
                            <Dialog open={isRevenueModalOpen} onOpenChange={setIsRevenueModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenRevenueModal()} className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Novo Faturamento
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="dark:bg-card dark:border-border">
                                    <DialogHeader>
                                        <DialogTitle className="dark:text-white">{editingRevenue ? "Editar Faturamento" : "Adicionar Novo Faturamento"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="rev-value" className="dark:text-gray-300">Valor Estimado (R$)</Label>
                                            <Input
                                                id="rev-value"
                                                placeholder="0,00"
                                                type="number"
                                                className="dark:bg-input dark:border-input dark:text-white"
                                                value={revenueVal}
                                                onChange={e => setRevenueVal(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="rev-period" className="dark:text-gray-300">Período</Label>
                                            <Select value={revenuePeriod} onValueChange={setRevenuePeriod}>
                                                <SelectTrigger className="dark:bg-input dark:border-input dark:text-white">
                                                    <SelectValue placeholder="Selecione o período" />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-card dark:border-border">
                                                    <SelectItem value="monthly" className="dark:text-gray-300 dark:focus:bg-muted">Mensal</SelectItem>
                                                    <SelectItem value="annual" className="dark:text-gray-300 dark:focus:bg-muted">Anual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={handleSaveRevenue} className="bg-violet-600 hover:bg-violet-700 w-full mt-2 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                            {editingRevenue ? "Atualizar Faturamento" : "Salvar Faturamento"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="rounded-md border bg-white dark:bg-card dark:border-border overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow className="dark:border-border">
                                        <TableHead className="dark:text-gray-400">DATA DE INCLUSÃO</TableHead>
                                        <TableHead className="dark:text-gray-400">VALOR ESTIMADO</TableHead>
                                        <TableHead className="dark:text-gray-400">PERÍODO</TableHead>
                                        <TableHead className="text-right dark:text-gray-400">AÇÕES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {revenues.map(revenue => (
                                        <TableRow key={revenue.id} className="dark:border-border">
                                            <TableCell className="dark:text-gray-300">
                                                {new Date(revenue.date).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell className="dark:text-gray-300">
                                                R$ {revenue.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="dark:text-gray-300">
                                                {revenue.period === 'monthly' ? 'Mensal' : 'Anual'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenRevenueModal(revenue)} className="dark:hover:bg-muted">
                                                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRevenue(revenue.id)} className="dark:hover:bg-muted">
                                                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAXES TAB --- */}
                <TabsContent value="taxes" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Impostos Configurados</h3>
                            <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => handleOpenTaxModal()} className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Imposto
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl dark:bg-card dark:border-border">
                                    <DialogHeader>
                                        <DialogTitle className="dark:text-white">{editingTax ? "Editar Imposto" : "Adicionar Novo Imposto"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="tax-type" className="dark:text-gray-300">Tipo de Imposto</Label>
                                                <Select value={taxType} onValueChange={setTaxType}>
                                                    <SelectTrigger className="dark:bg-input dark:border-input dark:text-white">
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent className="dark:bg-card dark:border-border">
                                                        <SelectItem value="ICMS" className="dark:text-gray-300 dark:focus:bg-muted">ICMS</SelectItem>
                                                        <SelectItem value="PIS" className="dark:text-gray-300 dark:focus:bg-muted">PIS</SelectItem>
                                                        <SelectItem value="COFINS" className="dark:text-gray-300 dark:focus:bg-muted">COFINS</SelectItem>
                                                        <SelectItem value="CPP" className="dark:text-gray-300 dark:focus:bg-muted">CPP</SelectItem>
                                                        <SelectItem value="ISSQN" className="dark:text-gray-300 dark:focus:bg-muted">ISSQN</SelectItem>
                                                        <SelectItem value="CSLL" className="dark:text-gray-300 dark:focus:bg-muted">CSLL</SelectItem>
                                                        <SelectItem value="IRPJ" className="dark:text-gray-300 dark:focus:bg-muted">IRPJ</SelectItem>
                                                        <SelectItem value="OTHERS" className="dark:text-gray-300 dark:focus:bg-muted">Outros</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="tax-name" className="dark:text-gray-300">Descrição/Nome</Label>
                                                <Input
                                                    id="tax-name"
                                                    placeholder="Ex: ICMS SP"
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                    value={taxName}
                                                    onChange={e => setTaxName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tax-rate" className="dark:text-gray-300">Alíquota (%)</Label>
                                            <Input
                                                id="tax-rate"
                                                placeholder="0.00"
                                                type="number"
                                                className="dark:bg-input dark:border-input dark:text-white"
                                                value={taxRate}
                                                onChange={e => setTaxRate(e.target.value)}
                                            />
                                        </div>
                                        <Button onClick={handleSaveTax} className="bg-violet-600 hover:bg-violet-700 w-full mt-2 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                            {editingTax ? "Atualizar Imposto" : "Salvar Imposto"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="rounded-md border bg-white dark:bg-card dark:border-border overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow className="dark:border-border">
                                        <TableHead className="dark:text-gray-400">TIPO</TableHead>
                                        <TableHead className="dark:text-gray-400">DESCRIÇÃO</TableHead>
                                        <TableHead className="dark:text-gray-400">ALÍQUOTA (%)</TableHead>
                                        <TableHead className="text-right dark:text-gray-400">AÇÕES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {taxes.map(tax => (
                                        <TableRow key={tax.id} className="dark:border-border">
                                            <TableCell className="dark:text-gray-300 font-medium">{tax.type || 'Outros'}</TableCell>
                                            <TableCell className="dark:text-gray-300">{tax.name}</TableCell>
                                            <TableCell className="dark:text-gray-300">{tax.rate}%</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenTaxModal(tax)} className="dark:hover:bg-muted">
                                                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTax(tax.id)} className="dark:hover:bg-muted">
                                                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
