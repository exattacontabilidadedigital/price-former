"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Trash2, Edit, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getCalculations, deleteCalculation } from "@/app/actions/calculation-actions"

interface Calculation {
  id: string
  calculationName?: string | null
  createdAt: Date | string
  productName: string
  costPrice: number
  markup: number
  suggestedPrice: number
  totalCosts: number
  totalTaxes: number
  profitMargin: number
  icms: number
  ipi: number
  freight: number
  otherCosts: number
  pis: number
  cofins: number
  cpp: number
  issqn: number
  csll: number
  irpj: number
  taxOthers: number
}

export default function CalculationListPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState("")
  const [filterColumn, setFilterColumn] = useState("all")
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Estados de seleção de colunas
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    calculationName: true,
    productName: true,
    costPrice: true,
    markup: true,
    suggestedPrice: true,
    totalCosts: true,
    totalTaxes: true,
    profitMargin: true,
    createdAt: false
  })

  useEffect(() => {
    loadCalculations()
  }, [])

  const loadCalculations = async () => {
    try {
      setLoading(true)
      const data = await getCalculations()
      setCalculations(data)
    } catch (error) {
      console.error("Erro ao carregar cálculos:", error)
      toast.error("Erro ao carregar cálculos salvos")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCalculation = async (id: string) => {
    try {
      await deleteCalculation(id)
      setCalculations(prev => prev.filter(calc => calc.id !== id))
      toast.success("Cálculo excluído com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir cálculo:", error)
      toast.error("Erro ao excluir cálculo")
    }
  }

  const filteredCalculations = useMemo(() => {
    return calculations.filter(calc => {
      const searchValue = searchTerm.toLowerCase()
      
      switch (filterColumn) {
        case "calculationName":
          return (calc.calculationName || "").toLowerCase().includes(searchValue)
        case "productName":
          return calc.productName.toLowerCase().includes(searchValue)
        case "all":
        default:
          return (
            (calc.calculationName || "").toLowerCase().includes(searchValue) ||
            calc.productName.toLowerCase().includes(searchValue) ||
            calc.costPrice.toString().includes(searchValue) ||
            calc.suggestedPrice.toString().includes(searchValue)
          )
      }
    })
  }, [calculations, searchTerm, filterColumn])
  
  const paginatedCalculations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCalculations.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCalculations, currentPage, itemsPerPage])
  
  const totalPages = Math.ceil(filteredCalculations.length / itemsPerPage)
  
  const handleColumnToggle = (column: string, checked: boolean) => {
    setVisibleColumns(prev => ({ ...prev, [column]: checked }))
  }
  
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cálculos Salvos</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie seus cálculos de precificação salvos
          </p>
        </div>
        
        {/* Controles de filtro e ações */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            {/* Campo de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar cálculos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Filtro por coluna */}
            <Select value={filterColumn} onValueChange={setFilterColumn}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os campos</SelectItem>
                <SelectItem value="calculationName">Nome do Cálculo</SelectItem>
                <SelectItem value="productName">Produto</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Seletor de colunas */}
            <Button 
              variant="outline" 
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="relative"
            >
              <Settings className="w-4 h-4 mr-2" />
              Colunas
            </Button>
          </div>
          
          <Link href="/calculator">
            <Button variant="default" className="bg-violet-600 hover:bg-violet-700 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Nova Calculadora
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Painel de seleção de colunas */}
      {showColumnSelector && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Selecionar Colunas Visíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="calculationName"
                  checked={visibleColumns.calculationName}
                  onCheckedChange={(checked) => handleColumnToggle("calculationName", !!checked)}
                />
                <label htmlFor="calculationName" className="text-sm font-medium">
                  Nome do Cálculo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="productName"
                  checked={visibleColumns.productName}
                  onCheckedChange={(checked) => handleColumnToggle("productName", !!checked)}
                />
                <label htmlFor="productName" className="text-sm font-medium">
                  Produto
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="costPrice"
                  checked={visibleColumns.costPrice}
                  onCheckedChange={(checked) => handleColumnToggle("costPrice", !!checked)}
                />
                <label htmlFor="costPrice" className="text-sm font-medium">
                  Custo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="markup"
                  checked={visibleColumns.markup}
                  onCheckedChange={(checked) => handleColumnToggle("markup", !!checked)}
                />
                <label htmlFor="markup" className="text-sm font-medium">
                  Markup (%)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suggestedPrice"
                  checked={visibleColumns.suggestedPrice}
                  onCheckedChange={(checked) => handleColumnToggle("suggestedPrice", !!checked)}
                />
                <label htmlFor="suggestedPrice" className="text-sm font-medium">
                  Preço Sugerido
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="totalCosts"
                  checked={visibleColumns.totalCosts}
                  onCheckedChange={(checked) => handleColumnToggle("totalCosts", !!checked)}
                />
                <label htmlFor="totalCosts" className="text-sm font-medium">
                  Custos Totais
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="totalTaxes"
                  checked={visibleColumns.totalTaxes}
                  onCheckedChange={(checked) => handleColumnToggle("totalTaxes", !!checked)}
                />
                <label htmlFor="totalTaxes" className="text-sm font-medium">
                  Impostos
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="profitMargin"
                  checked={visibleColumns.profitMargin}
                  onCheckedChange={(checked) => handleColumnToggle("profitMargin", !!checked)}
                />
                <label htmlFor="profitMargin" className="text-sm font-medium">
                  Margem
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createdAt"
                  checked={visibleColumns.createdAt}
                  onCheckedChange={(checked) => handleColumnToggle("createdAt", !!checked)}
                />
                <label htmlFor="createdAt" className="text-sm font-medium">
                  Data/Hora
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calculator className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Carregando cálculos...</h3>
            <p className="text-muted-foreground">
              Aguarde enquanto buscamos seus cálculos salvos.
            </p>
          </CardContent>
        </Card>
      ) : calculations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calculator className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum cálculo salvo</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não salvou nenhum cálculo. Comece criando uma nova precificação.
            </p>
            <Link href="/calculator">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                <Calculator className="w-4 h-4 mr-2" />
                Criar Primeiro Cálculo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Histórico de Cálculos ({filteredCalculations.length})
              </div>
              
              {/* Controle de itens por página */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Itens por página:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.calculationName && <TableHead>Nome do Cálculo</TableHead>}
                  {visibleColumns.productName && <TableHead>Produto</TableHead>}
                  {visibleColumns.costPrice && <TableHead>Custo</TableHead>}
                  {visibleColumns.markup && <TableHead>Markup (%)</TableHead>}
                  {visibleColumns.suggestedPrice && <TableHead>Preço Sugerido</TableHead>}
                  {visibleColumns.totalCosts && <TableHead>Custos Totais</TableHead>}
                  {visibleColumns.totalTaxes && <TableHead>Impostos</TableHead>}
                  {visibleColumns.profitMargin && <TableHead>Margem</TableHead>}
                  {visibleColumns.createdAt && <TableHead>Data/Hora</TableHead>}
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCalculations.map((calc) => (
                  <TableRow key={calc.id}>
                    {visibleColumns.calculationName && (
                      <TableCell className="font-medium">
                        {calc.calculationName || "Sem nome"}
                      </TableCell>
                    )}
                    {visibleColumns.productName && (
                      <TableCell className="font-medium text-blue-600">
                        {calc.productName}
                      </TableCell>
                    )}
                    {visibleColumns.costPrice && (
                      <TableCell>{formatCurrency(calc.costPrice)}</TableCell>
                    )}
                    {visibleColumns.markup && (
                      <TableCell>{calc.markup.toFixed(2)}%</TableCell>
                    )}
                    {visibleColumns.suggestedPrice && (
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(calc.suggestedPrice)}
                      </TableCell>
                    )}
                    {visibleColumns.totalCosts && (
                      <TableCell>{formatCurrency(calc.totalCosts)}</TableCell>
                    )}
                    {visibleColumns.totalTaxes && (
                      <TableCell>{formatCurrency(calc.totalTaxes)}</TableCell>
                    )}
                    {visibleColumns.profitMargin && (
                      <TableCell>
                        <span className={`font-medium ${
                          calc.profitMargin > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {calc.profitMargin.toFixed(2)}%
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.createdAt && (
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(calc.createdAt)}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex gap-1">
                        <Link 
                          href={`/calculator?load=${calc.id}`}
                          title="Carregar cálculo na calculadora"
                        >
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteCalculation(calc.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Excluir cálculo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredCalculations.length)} de {filteredCalculations.length} resultados
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
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
                            className="w-8 h-8"
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
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}