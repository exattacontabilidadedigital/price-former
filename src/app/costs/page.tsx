"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Upload, FileSpreadsheet, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    getExpenses, createExpense, updateExpense, deleteExpense, createExpenses, getPaginatedExpenses, getExpensesSummary,
    getRevenues, createRevenue, updateRevenue, deleteRevenue, createRevenues, getPaginatedRevenues, getRevenuesSummary,
    getTaxes, createTax, updateTax, deleteTax, createTaxes, getPaginatedTaxes
} from "@/app/actions/cost-actions"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
    const [expensesSummary, setExpensesSummary] = useState({ totalFixed: 0, totalVariable: 0 })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [revenues, setRevenues] = useState<Revenue[]>([])
    const [revenuesSummary, setRevenuesSummary] = useState({ totalMonthly: 0, totalAnnual: 0 })
    const [currentRevenuePage, setCurrentRevenuePage] = useState(1)
    const [totalRevenuePages, setTotalRevenuePages] = useState(1)
    const [totalRevenueItems, setTotalRevenueItems] = useState(0)
    const [revenueItemsPerPage, setRevenueItemsPerPage] = useState(10)
    const [taxes, setTaxes] = useState<Tax[]>([])
    const [currentTaxPage, setCurrentTaxPage] = useState(1)
    const [totalTaxPages, setTotalTaxPages] = useState(1)
    const [totalTaxItems, setTotalTaxItems] = useState(0)
    const [taxItemsPerPage, setTaxItemsPerPage] = useState(10)

    // Modals
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false)
    const [isImportRevenueModalOpen, setIsImportRevenueModalOpen] = useState(false)
    const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)
    const [isImportTaxModalOpen, setIsImportTaxModalOpen] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [isImportingRevenue, setIsImportingRevenue] = useState(false)
    const [isImportingTax, setIsImportingTax] = useState(false)

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
        const [paginatedExpenses, summary, paginatedRevenues, revSummary, paginatedTaxes] = await Promise.all([
            getPaginatedExpenses(currentPage, itemsPerPage),
            getExpensesSummary(),
            getPaginatedRevenues(currentRevenuePage, revenueItemsPerPage),
            getRevenuesSummary(),
            getPaginatedTaxes(currentTaxPage, taxItemsPerPage)
        ])
        setExpenses(paginatedExpenses.expenses)
        setTotalPages(paginatedExpenses.totalPages)
        setTotalItems(paginatedExpenses.totalItems)
        setExpensesSummary(summary)
        
        setRevenues(paginatedRevenues.revenues)
        setTotalRevenuePages(paginatedRevenues.totalPages)
        setTotalRevenueItems(paginatedRevenues.totalItems)
        setRevenuesSummary(revSummary)
        
        setTaxes(paginatedTaxes.taxes)
        setTotalTaxPages(paginatedTaxes.totalPages)
        setTotalTaxItems(paginatedTaxes.totalItems)
    }

    useEffect(() => {
        fetchData()
    }, [currentPage, itemsPerPage, currentRevenuePage, revenueItemsPerPage, currentTaxPage, taxItemsPerPage])

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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split('\n')
                const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase())
                
                const expensesToCreate = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue
                    
                    const values = lines[i].split(/[;,]/).map(v => v.trim())
                    const expense: any = {}
                    
                    // Map common CSV headers to expense fields
                    headers.forEach((header, index) => {
                        const value = values[index]
                        if (!value) return

                        if (header.includes('descrição') || header.includes('nome') || header.includes('despesa')) {
                            expense.description = value
                        } else if (header.includes('valor') || header.includes('preço')) {
                            expense.value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        } else if (header.includes('tipo')) {
                            const typeValue = value.toLowerCase()
                            if (typeValue.includes('fix')) {
                                expense.type = 'fixed'
                            } else if (typeValue.includes('vari')) {
                                expense.type = 'variable'
                            } else {
                                expense.type = 'fixed' // Default
                            }
                        }
                    })

                    if (expense.description && expense.value !== undefined) {
                        if (!expense.type) expense.type = 'fixed'
                        expensesToCreate.push(expense)
                    }
                }

                if (expensesToCreate.length > 0) {
                    await createExpenses(expensesToCreate)
                    toast.success(`${expensesToCreate.length} despesas importadas com sucesso!`)
                    await fetchData()
                    setIsImportModalOpen(false)
                } else {
                    toast.error("Nenhuma despesa válida encontrada no arquivo CSV.")
                }
            } catch (error) {
                console.error("Erro ao importar CSV:", error)
                toast.error("Erro ao processar o arquivo CSV. Verifique o formato.")
            } finally {
                setIsImporting(false)
                // Reset file input
                event.target.value = ''
            }
        }

        reader.readAsText(file)
    }

    const handleDownloadTemplate = () => {
        const headers = [
            "Descrição",
            "Valor",
            "Tipo (Fixo/Variável)"
        ]
        const csvContent = headers.join(";") + "\n"
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "modelo_importacao_despesas.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleRevenueFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsImportingRevenue(true)
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split('\n')
                const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase())
                
                const revenuesToCreate = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue
                    
                    const values = lines[i].split(/[;,]/).map(v => v.trim())
                    const revenue: any = {}
                    
                    // Map common CSV headers to revenue fields
                    headers.forEach((header, index) => {
                        const value = values[index]
                        if (!value) return

                        if (header.includes('valor') || header.includes('faturamento')) {
                            revenue.value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        } else if (header.includes('período') || header.includes('periodo')) {
                            const periodValue = value.toLowerCase()
                            if (periodValue.includes('mensal')) {
                                revenue.period = 'monthly'
                            } else if (periodValue.includes('anual')) {
                                revenue.period = 'annual'
                            } else {
                                revenue.period = 'monthly' // Default
                            }
                        }
                    })

                    if (revenue.value !== undefined) {
                        if (!revenue.period) revenue.period = 'monthly'
                        revenuesToCreate.push(revenue)
                    }
                }

                if (revenuesToCreate.length > 0) {
                    await createRevenues(revenuesToCreate)
                    toast.success(`${revenuesToCreate.length} faturamentos importados com sucesso!`)
                    await fetchData()
                    setIsImportRevenueModalOpen(false)
                } else {
                    toast.error("Nenhum faturamento válido encontrado no arquivo CSV.")
                }
            } catch (error) {
                console.error("Erro ao importar CSV:", error)
                toast.error("Erro ao processar o arquivo CSV. Verifique o formato.")
            } finally {
                setIsImportingRevenue(false)
                // Reset file input
                event.target.value = ''
            }
        }

        reader.readAsText(file)
    }

    const handleDownloadRevenueTemplate = () => {
        const headers = [
            "Valor",
            "Período (Mensal/Anual)"
        ]
        const csvContent = headers.join(";") + "\n"
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "modelo_importacao_faturamento.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleTaxFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsImportingTax(true)
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split('\n')
                const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase())
                
                const taxesToCreate = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue
                    
                    const values = lines[i].split(/[;,]/).map(v => v.trim())
                    const tax: any = {}
                    
                    // Map common CSV headers to tax fields
                    headers.forEach((header, index) => {
                        const value = values[index]
                        if (!value) return

                        if (header.includes('nome') || header.includes('descrição')) {
                            tax.name = value
                        } else if (header.includes('alíquota') || header.includes('taxa') || header.includes('rate')) {
                            tax.rate = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header.includes('tipo')) {
                            const typeValue = value.toUpperCase()
                            const validTypes = ['ICMS', 'PIS', 'COFINS', 'CPP', 'ISSQN', 'CSLL', 'IRPJ', 'OTHERS']
                            if (validTypes.includes(typeValue)) {
                                tax.type = typeValue
                            } else {
                                tax.type = 'OTHERS' // Default
                            }
                        }
                    })

                    if (tax.name && tax.rate !== undefined) {
                        if (!tax.type) tax.type = 'OTHERS'
                        taxesToCreate.push(tax)
                    }
                }

                if (taxesToCreate.length > 0) {
                    await createTaxes(taxesToCreate)
                    toast.success(`${taxesToCreate.length} impostos importados com sucesso!`)
                    await fetchData()
                    setIsImportTaxModalOpen(false)
                } else {
                    toast.error("Nenhum imposto válido encontrado no arquivo CSV.")
                }
            } catch (error) {
                console.error("Erro ao importar CSV:", error)
                toast.error("Erro ao processar o arquivo CSV. Verifique o formato.")
            } finally {
                setIsImportingTax(false)
                // Reset file input
                event.target.value = ''
            }
        }

        reader.readAsText(file)
    }

    const handleDownloadTaxTemplate = () => {
        const headers = [
            "Nome/Descrição",
            "Alíquota (%)",
            "Tipo (ICMS/PIS/COFINS/CPP/ISSQN/CSLL/IRPJ/OTHERS)"
        ]
        const csvContent = headers.join(";") + "\n"
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "modelo_importacao_impostos.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
    const totalFixedExpenses = expensesSummary.totalFixed

    const totalVariableExpenses = expensesSummary.totalVariable

    const totalRevenueMonthly = revenuesSummary.totalMonthly

    const totalRevenueAnnual = revenuesSummary.totalAnnual

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
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Despesas Fixas e Variáveis</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Itens:</span>
                                    <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                                        setItemsPerPage(Number(value))
                                        setCurrentPage(1)
                                    }}>
                                        <SelectTrigger className="w-16 h-8 dark:bg-input dark:border-input dark:text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-card dark:border-border">
                                            <SelectItem value="5" className="dark:text-gray-300 dark:focus:bg-muted">5</SelectItem>
                                            <SelectItem value="10" className="dark:text-gray-300 dark:focus:bg-muted">10</SelectItem>
                                            <SelectItem value="20" className="dark:text-gray-300 dark:focus:bg-muted">20</SelectItem>
                                            <SelectItem value="50" className="dark:text-gray-300 dark:focus:bg-muted">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark:bg-card dark:border-border">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">Importar Despesas via CSV</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center space-y-2">
                                                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Selecione um arquivo CSV para importar suas despesas.
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    Colunas esperadas: Descrição, Valor, Tipo (Fixo/Variável)
                                                </p>
                                                <Button 
                                                    variant="link" 
                                                    onClick={handleDownloadTemplate}
                                                    className="text-violet-600 dark:text-violet-400 h-auto p-0 text-xs"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Baixar modelo CSV
                                                </Button>
                                            </div>
                                            <div className="flex justify-center">
                                                <Input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleFileUpload}
                                                    disabled={isImporting}
                                                    className="max-w-xs dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            {isImporting && (
                                                <p className="text-center text-sm text-violet-600 dark:text-violet-400 animate-pulse">
                                                    Processando arquivo...
                                                </p>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>

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

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 py-4">
                                <div className="text-sm text-muted-foreground dark:text-gray-400">
                                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Anterior
                                    </Button>
                                    
                                    <div className="flex items-center gap-1 hidden sm:flex">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === totalPages || 
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            )
                                            .map((page, index, array) => (
                                                <div key={page} className="flex items-center">
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2 text-muted-foreground">...</span>
                                                    )}
                                                    <Button
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 ${currentPage === page 
                                                            ? "bg-violet-600 hover:bg-violet-700 text-white" 
                                                            : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
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
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Estimativas de Faturamento</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Itens:</span>
                                    <Select value={revenueItemsPerPage.toString()} onValueChange={(value) => {
                                        setRevenueItemsPerPage(Number(value))
                                        setCurrentRevenuePage(1)
                                    }}>
                                        <SelectTrigger className="w-16 h-8 dark:bg-input dark:border-input dark:text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-card dark:border-border">
                                            <SelectItem value="5" className="dark:text-gray-300 dark:focus:bg-muted">5</SelectItem>
                                            <SelectItem value="10" className="dark:text-gray-300 dark:focus:bg-muted">10</SelectItem>
                                            <SelectItem value="20" className="dark:text-gray-300 dark:focus:bg-muted">20</SelectItem>
                                            <SelectItem value="50" className="dark:text-gray-300 dark:focus:bg-muted">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={isImportRevenueModalOpen} onOpenChange={setIsImportRevenueModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark:bg-card dark:border-border">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">Importar Faturamento via CSV</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center space-y-2">
                                                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Selecione um arquivo CSV para importar seus faturamentos.
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    Colunas esperadas: Valor, Período (Mensal/Anual)
                                                </p>
                                                <Button 
                                                    variant="link" 
                                                    onClick={handleDownloadRevenueTemplate}
                                                    className="text-violet-600 dark:text-violet-400 h-auto p-0 text-xs"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Baixar modelo CSV
                                                </Button>
                                            </div>
                                            <div className="flex justify-center">
                                                <Input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleRevenueFileUpload}
                                                    disabled={isImportingRevenue}
                                                    className="max-w-xs dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            {isImportingRevenue && (
                                                <p className="text-center text-sm text-violet-600 dark:text-violet-400 animate-pulse">
                                                    Processando arquivo...
                                                </p>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>

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

                        {totalRevenuePages > 1 && (
                            <div className="flex items-center justify-between mt-4 py-4">
                                <div className="text-sm text-muted-foreground dark:text-gray-400">
                                    Mostrando {((currentRevenuePage - 1) * revenueItemsPerPage) + 1} a {Math.min(currentRevenuePage * revenueItemsPerPage, totalRevenueItems)} de {totalRevenueItems} resultados
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentRevenuePage(prev => Math.max(1, prev - 1))}
                                        disabled={currentRevenuePage === 1}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Anterior
                                    </Button>
                                    
                                    <div className="flex items-center gap-1 hidden sm:flex">
                                        {Array.from({ length: totalRevenuePages }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === totalRevenuePages || 
                                                (page >= currentRevenuePage - 1 && page <= currentRevenuePage + 1)
                                            )
                                            .map((page, index, array) => (
                                                <div key={page} className="flex items-center">
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2 text-muted-foreground">...</span>
                                                    )}
                                                    <Button
                                                        variant={currentRevenuePage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentRevenuePage(page)}
                                                        className={`w-8 h-8 ${currentRevenuePage === page 
                                                            ? "bg-violet-600 hover:bg-violet-700 text-white" 
                                                            : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentRevenuePage(prev => Math.min(totalRevenuePages, prev + 1))}
                                        disabled={currentRevenuePage === totalRevenuePages}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* --- TAXES TAB --- */}
                <TabsContent value="taxes" className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Impostos Configurados</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Itens:</span>
                                    <Select value={taxItemsPerPage.toString()} onValueChange={(value) => {
                                        setTaxItemsPerPage(Number(value))
                                        setCurrentTaxPage(1)
                                    }}>
                                        <SelectTrigger className="w-16 h-8 dark:bg-input dark:border-input dark:text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-card dark:border-border">
                                            <SelectItem value="5" className="dark:text-gray-300 dark:focus:bg-muted">5</SelectItem>
                                            <SelectItem value="10" className="dark:text-gray-300 dark:focus:bg-muted">10</SelectItem>
                                            <SelectItem value="20" className="dark:text-gray-300 dark:focus:bg-muted">20</SelectItem>
                                            <SelectItem value="50" className="dark:text-gray-300 dark:focus:bg-muted">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={isImportTaxModalOpen} onOpenChange={setIsImportTaxModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Importar CSV
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark:bg-card dark:border-border">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-white">Importar Impostos via CSV</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center space-y-2">
                                                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Selecione um arquivo CSV para importar seus impostos.
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    Colunas esperadas: Nome/Descrição, Alíquota (%), Tipo
                                                </p>
                                                <Button 
                                                    variant="link" 
                                                    onClick={handleDownloadTaxTemplate}
                                                    className="text-violet-600 dark:text-violet-400 h-auto p-0 text-xs"
                                                >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    Baixar modelo CSV
                                                </Button>
                                            </div>
                                            <div className="flex justify-center">
                                                <Input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleTaxFileUpload}
                                                    disabled={isImportingTax}
                                                    className="max-w-xs dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            {isImportingTax && (
                                                <p className="text-center text-sm text-violet-600 dark:text-violet-400 animate-pulse">
                                                    Processando arquivo...
                                                </p>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>

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

                        {totalTaxPages > 1 && (
                            <div className="flex items-center justify-between mt-4 py-4">
                                <div className="text-sm text-muted-foreground dark:text-gray-400">
                                    Mostrando {((currentTaxPage - 1) * taxItemsPerPage) + 1} a {Math.min(currentTaxPage * taxItemsPerPage, totalTaxItems)} de {totalTaxItems} resultados
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentTaxPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentTaxPage === 1}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Anterior
                                    </Button>
                                    
                                    <div className="flex items-center gap-1 hidden sm:flex">
                                        {Array.from({ length: totalTaxPages }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === totalTaxPages || 
                                                (page >= currentTaxPage - 1 && page <= currentTaxPage + 1)
                                            )
                                            .map((page, index, array) => (
                                                <div key={page} className="flex items-center">
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2 text-muted-foreground">...</span>
                                                    )}
                                                    <Button
                                                        variant={currentTaxPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentTaxPage(page)}
                                                        className={`w-8 h-8 ${currentTaxPage === page 
                                                            ? "bg-violet-600 hover:bg-violet-700 text-white" 
                                                            : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentTaxPage(prev => Math.min(totalTaxPages, prev + 1))}
                                        disabled={currentTaxPage === totalTaxPages}
                                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
