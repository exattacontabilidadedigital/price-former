"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Calculator, Upload, FileSpreadsheet, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { getProducts, createProduct, updateProduct, deleteProduct, createProducts, getPaginatedProducts } from "@/app/actions/product-actions"
import { getTaxes } from "@/app/actions/cost-actions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const productSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    ncm: z.string().optional(),
    costPrice: z.coerce.number().min(0, "Custo deve ser maior ou igual a 0"),
    icms: z.coerce.number().optional(),
    icmsPurchase: z.coerce.number().optional(),
    ipi: z.coerce.number().optional(),
    ipiPurchase: z.coerce.number().optional(),
    freight: z.coerce.number().optional(),
    others: z.coerce.number().optional(),
    markup: z.coerce.number().optional(),
    profitMargin: z.coerce.number().optional(),
    salesPrice: z.coerce.number().optional(),
    pis: z.coerce.number().optional(),
    cofins: z.coerce.number().optional(),
    cpp: z.coerce.number().optional(),
    issqn: z.coerce.number().optional(),
    csll: z.coerce.number().optional(),
    irpj: z.coerce.number().optional(),
    taxOthers: z.coerce.number().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface Product {
    id: string
    name: string
    ncm?: string | null
    salesPrice?: number | null
    markup?: number | null
    costPrice: number
    icms?: number | null
    icmsPurchase?: number | null
    ipi?: number | null
    ipiPurchase?: number | null
    freight?: number | null
    others?: number | null
    pis?: number | null
    cofins?: number | null
    cpp?: number | null
    issqn?: number | null
    csll?: number | null
    irpj?: number | null
    taxOthers?: number | null
    createdAt: Date
    updatedAt: Date
}

interface Tax {
    id: string
    name: string
    rate: number
    type: string
}

export default function ProductsPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [globalTaxes, setGlobalTaxes] = useState<Tax[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            ncm: "",
            costPrice: 0,
            icms: 0,
            icmsPurchase: 0,
            ipi: 0,
            ipiPurchase: 0,
            freight: 0,
            others: 0,
            markup: 0,
            profitMargin: 0,
            salesPrice: 0,
            pis: 0,
            cofins: 0,
            cpp: 0,
            issqn: 0,
            csll: 0,
            irpj: 0,
            taxOthers: 0,
        },
    })

    const fetchProducts = async () => {
        try {
            const [productsData, taxesData] = await Promise.all([
                getPaginatedProducts(currentPage, itemsPerPage),
                getTaxes()
            ])
            setProducts(productsData.products)
            setTotalPages(productsData.totalPages)
            setTotalItems(productsData.totalItems)
            setGlobalTaxes(taxesData)
        } catch (error) {
            toast.error("Erro ao carregar dados")
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [currentPage, itemsPerPage])

    const getGlobalTax = (type: string) => {
        return globalTaxes
            .filter(t => t.type === type)
            .reduce((acc, curr) => acc + curr.rate, 0)
    }

    useEffect(() => {
        if (editingProduct) {
            form.reset({
                name: editingProduct.name,
                ncm: editingProduct.ncm || "",
                costPrice: editingProduct.costPrice,
                icms: editingProduct.icms || 0,
                icmsPurchase: editingProduct.icmsPurchase || 0,
                ipi: editingProduct.ipi || 0,
                ipiPurchase: editingProduct.ipiPurchase || 0,
                freight: editingProduct.freight || 0,
                others: editingProduct.others || 0,
                markup: editingProduct.markup || 0,
                profitMargin: 0, // Calculated field, not persisted
                salesPrice: editingProduct.salesPrice || 0,
                pis: editingProduct.pis || 0,
                cofins: editingProduct.cofins || 0,
                cpp: editingProduct.cpp || 0,
                issqn: editingProduct.issqn || 0,
                csll: editingProduct.csll || 0,
                irpj: editingProduct.irpj || 0,
                taxOthers: editingProduct.taxOthers || 0,
            })
        } else {
            form.reset({
                name: "",
                ncm: "",
                costPrice: 0,
                icms: getGlobalTax('ICMS'),
                icmsPurchase: 0,
                ipi: 0,
                ipiPurchase: 0,
                freight: 0,
                others: 0,
                markup: 0,
                profitMargin: 0,
                salesPrice: 0,
                pis: getGlobalTax('PIS'),
                cofins: getGlobalTax('COFINS'),
                cpp: getGlobalTax('CPP'),
                issqn: getGlobalTax('ISSQN'),
                csll: getGlobalTax('CSLL'),
                irpj: getGlobalTax('IRPJ'),
                taxOthers: getGlobalTax('OTHERS'),
            })
        }
    }, [editingProduct, form, globalTaxes])

    const handleOpenChange = (open: boolean) => {
        setIsModalOpen(open)
        if (!open) {
            setEditingProduct(null)
            form.reset()
        }
    }

    const calculatePricing = (trigger: "cost" | "markup" | "margin" | "price") => {
        const values = form.getValues()
        const cost = Number(values.costPrice || 0)
        const icmsPurchase = Number(values.icmsPurchase || 0)
        const ipiPurchase = Number(values.ipiPurchase || 0)
        const freight = Number(values.freight || 0)
        const others = Number(values.others || 0)
        const totalCost = cost * (1 + icmsPurchase / 100 + ipiPurchase / 100) + freight + others

        if (totalCost === 0) return

        if (trigger === "cost") {
            // Recalculate price based on existing markup
            const markup = Number(values.markup || 0)
            const price = totalCost * (1 + markup / 100)
            form.setValue("salesPrice", Number(price.toFixed(2)))

            // Recalculate margin
            if (price > 0) {
                const margin = ((price - totalCost) / price) * 100
                form.setValue("profitMargin", Number(margin.toFixed(2)))
            }
        } else if (trigger === "markup") {
            const markup = Number(values.markup || 0)
            const price = totalCost * (1 + markup / 100)
            form.setValue("salesPrice", Number(price.toFixed(2)))

            if (price > 0) {
                const margin = ((price - totalCost) / price) * 100
                form.setValue("profitMargin", Number(margin.toFixed(2)))
            }
        } else if (trigger === "margin") {
            const margin = Number(values.profitMargin || 0)
            if (margin < 100) {
                const price = totalCost / (1 - margin / 100)
                form.setValue("salesPrice", Number(price.toFixed(2)))

                const markup = ((price - totalCost) / totalCost) * 100
                form.setValue("markup", Number(markup.toFixed(2)))
            }
        } else if (trigger === "price") {
            const price = Number(values.salesPrice || 0)
            if (price > 0) {
                const markup = ((price - totalCost) / totalCost) * 100
                form.setValue("markup", Number(markup.toFixed(2)))

                const margin = ((price - totalCost) / price) * 100
                form.setValue("profitMargin", Number(margin.toFixed(2)))
            }
        }
    }

    const onSubmit = async (data: ProductFormValues) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data)
                toast.success("Produto atualizado com sucesso")
            } else {
                await createProduct(data)
                toast.success("Produto criado com sucesso")
            }
            await fetchProducts()
            handleOpenChange(false)
        } catch (error) {
            console.error("Error saving product:", error)
            toast.error("Erro ao salvar produto")
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                await deleteProduct(id)
                toast.success("Produto excluído com sucesso")
                await fetchProducts()
            } catch (error) {
                console.error("Error deleting product:", error)
                toast.error("Erro ao excluir produto")
            }
        }
    }

    const handleCalculate = (productId: string) => {
        router.push(`/calculator?productId=${productId}`)
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
                
                const productsToCreate = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue
                    
                    const values = lines[i].split(/[;,]/).map(v => v.trim())
                    const product: any = {}
                    
                    // Map common CSV headers to product fields
                    headers.forEach((header, index) => {
                        const value = values[index]
                        if (!value) return

                        if (header.includes('nome') || header.includes('produto') || header.includes('descrição')) {
                            product.name = value
                        } else if (header.includes('ncm')) {
                            product.ncm = value
                        } else if (header.includes('custo') || header.includes('preço custo')) {
                            product.costPrice = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        } else if (header.includes('venda') || header.includes('preço venda')) {
                            product.salesPrice = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        } else if (header.includes('markup')) {
                            product.markup = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header === 'icms' || header.includes('icms venda')) {
                            product.icms = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header.includes('icms compra')) {
                            product.icmsPurchase = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header === 'ipi' || header.includes('ipi venda')) {
                            product.ipi = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header.includes('ipi compra')) {
                            product.ipiPurchase = parseFloat(value.replace('%', '').replace(',', '.')) || 0
                        } else if (header.includes('frete')) {
                            product.freight = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        } else if (header.includes('outros')) {
                            product.others = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.')) || 0
                        }
                    })

                    if (product.name && (product.costPrice !== undefined || product.salesPrice !== undefined)) {
                        // Set default values for taxes if not present in CSV
                        if (product.icms === undefined) product.icms = getGlobalTax('ICMS')
                        if (product.pis === undefined) product.pis = getGlobalTax('PIS')
                        if (product.cofins === undefined) product.cofins = getGlobalTax('COFINS')
                        if (product.cpp === undefined) product.cpp = getGlobalTax('CPP')
                        if (product.issqn === undefined) product.issqn = getGlobalTax('ISSQN')
                        if (product.csll === undefined) product.csll = getGlobalTax('CSLL')
                        if (product.irpj === undefined) product.irpj = getGlobalTax('IRPJ')
                        if (product.taxOthers === undefined) product.taxOthers = getGlobalTax('OTHERS')
                        
                        productsToCreate.push(product)
                    }
                }

                if (productsToCreate.length > 0) {
                    await createProducts(productsToCreate)
                    toast.success(`${productsToCreate.length} produtos importados com sucesso!`)
                    await fetchProducts()
                    setIsImportModalOpen(false)
                } else {
                    toast.error("Nenhum produto válido encontrado no arquivo CSV.")
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
            "Nome",
            "NCM",
            "Custo",
            "ICMS Compra",
            "IPI Compra",
            "Frete",
            "Outros",
            "ICMS Venda",
            "IPI Venda",
            "Markup",
            "Preço Venda"
        ]
        const csvContent = headers.join(";") + "\n"
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "modelo_importacao_produtos.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Cadastro de Produtos</h2>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie seus produtos e suas informações.</p>
                </div>
                <div className="flex items-center gap-4">
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
                                <DialogTitle className="dark:text-white">Importar Produtos via CSV</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center space-y-2">
                                    <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Selecione um arquivo CSV para importar seus produtos.
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Colunas esperadas: Nome, NCM, Custo, ICMS Compra, IPI Compra, Frete, Outros, ICMS Venda, IPI Venda, Markup, Preço Venda
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

                    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                <Plus className="w-4 h-4 mr-2" />
                                {editingProduct ? "Editar Produto" : "Novo Produto"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-2xl dark:bg-card dark:border-border max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="dark:text-white">{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4">
                                <Tabs defaultValue="general" className="w-full">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="general">Geral</TabsTrigger>
                                        <TabsTrigger value="acquisition">Custo Aquisição</TabsTrigger>
                                        <TabsTrigger value="taxes">Impostos</TabsTrigger>
                                        <TabsTrigger value="pricing">Precificação</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="general" className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="dark:text-gray-300">Nome do Produto</Label>
                                            <Input
                                                id="name"
                                                {...form.register("name")}
                                                className="dark:bg-input dark:border-input dark:text-white"
                                            />
                                            {form.formState.errors.name && (
                                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ncm" className="dark:text-gray-300">NCM</Label>
                                            <Input
                                                id="ncm"
                                                {...form.register("ncm")}
                                                className="dark:bg-input dark:border-input dark:text-white"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="acquisition" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="costPrice" className="dark:text-gray-300">Custo do Produto (R$)</Label>
                                                <Input
                                                    id="costPrice"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("costPrice", {
                                                        onChange: () => calculatePricing("cost")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                                {form.formState.errors.costPrice && (
                                                    <p className="text-sm text-red-500">{form.formState.errors.costPrice.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="icmsPurchase" className="dark:text-gray-300">ICMS Compra (%)</Label>
                                                <Input
                                                    id="icmsPurchase"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("icmsPurchase", {
                                                        onChange: () => calculatePricing("cost")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ipiPurchase" className="dark:text-gray-300">IPI Compra (%)</Label>
                                                <Input
                                                    id="ipiPurchase"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("ipiPurchase", {
                                                        onChange: () => calculatePricing("cost")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="freight" className="dark:text-gray-300">Frete (R$)</Label>
                                                <Input
                                                    id="freight"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("freight", {
                                                        onChange: () => calculatePricing("cost")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="others" className="dark:text-gray-300">Outros (R$)</Label>
                                                <Input
                                                    id="others"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("others", {
                                                        onChange: () => calculatePricing("cost")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="dark:text-gray-300 font-bold">Total Custo Aquisição (R$)</Label>
                                                <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm dark:bg-muted dark:text-white dark:border-gray-700 font-bold items-center">
                                                    {(() => {
                                                        const cost = Number(form.watch("costPrice") || 0)
                                                        const icmsPurchase = Number(form.watch("icmsPurchase") || 0)
                                                        const ipiPurchase = Number(form.watch("ipiPurchase") || 0)
                                                        const freight = Number(form.watch("freight") || 0)
                                                        const others = Number(form.watch("others") || 0)
                                                        const totalCost = cost * (1 + icmsPurchase / 100 + ipiPurchase / 100) + freight + others
                                                        return totalCost.toFixed(2)
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="taxes" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="icms" className="dark:text-gray-300">ICMS Venda (%)</Label>
                                                <Input
                                                    id="icms"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("icms")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="ipi" className="dark:text-gray-300">IPI Venda (%)</Label>
                                                <Input
                                                    id="ipi"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("ipi")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pis" className="dark:text-gray-300">PIS (%)</Label>
                                                <Input
                                                    id="pis"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("pis")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cofins" className="dark:text-gray-300">COFINS (%)</Label>
                                                <Input
                                                    id="cofins"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("cofins")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cpp" className="dark:text-gray-300">CPP (%)</Label>
                                                <Input
                                                    id="cpp"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("cpp")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="issqn" className="dark:text-gray-300">ISSQN (%)</Label>
                                                <Input
                                                    id="issqn"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("issqn")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="csll" className="dark:text-gray-300">CSLL (%)</Label>
                                                <Input
                                                    id="csll"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("csll")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="irpj" className="dark:text-gray-300">IRPJ (%)</Label>
                                                <Input
                                                    id="irpj"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("irpj")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="taxOthers" className="dark:text-gray-300">Outros Impostos (%)</Label>
                                                <Input
                                                    id="taxOthers"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("taxOthers")}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="dark:text-gray-300 font-bold">Total Impostos (%)</Label>
                                                <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm dark:bg-muted dark:text-white dark:border-gray-700 font-bold items-center">
                                                    {(() => {
                                                        const icms = Number(form.watch("icms") || 0)
                                                        const ipi = Number(form.watch("ipi") || 0)
                                                        const pis = Number(form.watch("pis") || 0)
                                                        const cofins = Number(form.watch("cofins") || 0)
                                                        const cpp = Number(form.watch("cpp") || 0)
                                                        const issqn = Number(form.watch("issqn") || 0)
                                                        const csll = Number(form.watch("csll") || 0)
                                                        const irpj = Number(form.watch("irpj") || 0)
                                                        const taxOthers = Number(form.watch("taxOthers") || 0)
                                                        return (icms + ipi + pis + cofins + cpp + issqn + csll + irpj + taxOthers).toFixed(2)
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="pricing" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="markup" className="dark:text-gray-300">Markup (%)</Label>
                                                <Input
                                                    id="markup"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("markup", {
                                                        onChange: () => calculatePricing("markup")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="profitMargin" className="dark:text-gray-300">Margem de Lucro (%)</Label>
                                                <Input
                                                    id="profitMargin"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("profitMargin", {
                                                        onChange: () => calculatePricing("margin")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="salesPrice" className="dark:text-gray-300">Preço de Venda (R$)</Label>
                                                <Input
                                                    id="salesPrice"
                                                    type="number"
                                                    step="0.01"
                                                    {...form.register("salesPrice", {
                                                        onChange: () => calculatePricing("price")
                                                    })}
                                                    className="dark:bg-input dark:border-input dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="mt-6">
                                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white" style={{color: 'white'}}>
                                        {editingProduct ? "Atualizar" : "Salvar"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                </div>
            </div>

            <Card className="dark:bg-card dark:border-border">
                <CardHeader>
                    <CardTitle className="dark:text-white">Lista de Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="dark:border-gray-700">
                                <TableHead className="dark:text-gray-300">NCM</TableHead>
                                <TableHead className="dark:text-gray-300">PRODUTO</TableHead>
                                <TableHead className="dark:text-gray-300 text-violet-600 dark:text-violet-400">VENDA</TableHead>
                                <TableHead className="dark:text-gray-300">MARKUP (%)</TableHead>
                                <TableHead className="dark:text-gray-300">LUCRO (%)</TableHead>
                                <TableHead className="dark:text-gray-300">CUSTO (%)</TableHead>
                                <TableHead className="dark:text-gray-300">MARGEM (%)</TableHead>
                                <TableHead className="dark:text-gray-300">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const costPrice = product.costPrice || 0
                                const icmsPurchase = product.icmsPurchase || 0
                                const ipiPurchase = product.ipiPurchase || 0
                                const freight = product.freight || 0
                                const others = product.others || 0
                                const totalCost = costPrice * (1 + icmsPurchase / 100 + ipiPurchase / 100) + freight + others
                                const salePrice = product.salesPrice || 0
                                const markup = product.markup || 0
                                const marginPercent = salePrice > 0 ? ((salePrice - totalCost) / salePrice * 100) : 0
                                const costPercent = salePrice > 0 ? (totalCost / salePrice * 100) : 0
                                const profitPercent = marginPercent
                                return (
                                    <TableRow key={product.id} className="dark:border-gray-700">
                                        <TableCell className="dark:text-gray-300">{product.ncm || "-"}</TableCell>
                                        <TableCell className="dark:text-gray-300">{product.name}</TableCell>
                                        <TableCell className="dark:text-gray-300 text-violet-600 dark:text-violet-400 font-semibold">
                                            {salePrice > 0 ? `R$ ${salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                                        </TableCell>
                                        <TableCell className="dark:text-gray-300">{markup > 0 ? `${markup.toFixed(1)}%` : "-"}</TableCell>
                                        <TableCell className="dark:text-gray-300">{salePrice > 0 ? `${profitPercent.toFixed(1)}%` : "-"}</TableCell>
                                        <TableCell className="dark:text-gray-300">{salePrice > 0 ? `${costPercent.toFixed(1)}%` : "-"}</TableCell>
                                        <TableCell className="dark:text-gray-300">{salePrice > 0 ? `${marginPercent.toFixed(1)}%` : "-"}</TableCell>
                                        <TableCell className="dark:text-gray-300">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleCalculate(product.id)} className="dark:hover:bg-muted"><Calculator className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="dark:hover:bg-muted"><Pencil className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="dark:hover:bg-muted"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

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
                </CardContent>
            </Card>
        </div>
    )
}
