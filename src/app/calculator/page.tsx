"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save, Trash2 } from "lucide-react"
import { getProducts, updateProduct } from "@/app/actions/product-actions"
import { getExpenses, getRevenues, getTaxes } from "@/app/actions/cost-actions"
import { saveCalculation, getCalculation } from "@/app/actions/calculation-actions"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  ncm?: string | null
  costPrice: number
  markup?: number | null
  salesPrice?: number | null
  icms?: number | null
  ipi?: number | null
  freight?: number | null
  others?: number | null
  pis?: number | null
  cofins?: number | null
  cpp?: number | null
  issqn?: number | null
  csll?: number | null
  irpj?: number | null
  taxOthers?: number | null
}

interface Expense {
  id: string
  value: number
  type: string
}

interface Revenue {
  id: string
  value: number
  period: string
}

interface Tax {
  id: string
  name: string
  rate: number
  type?: string
}



function MarkupCalculatorContent() {
  const searchParams = useSearchParams()
  const productIdFromUrl = searchParams.get('productId')

  // Data State
  const [products, setProducts] = useState<Product[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [revenues, setRevenues] = useState<Revenue[]>([])
  const [globalTaxes, setGlobalTaxes] = useState<Tax[]>([])

  // Selection State
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentCalculationId, setCurrentCalculationId] = useState<string | null>(null)

  // Input State
  const [desiredProfitMargin, setDesiredProfitMargin] = useState("")
  const [calculationName, setCalculationName] = useState("")

  // Computed/Form State (can be overridden by user, but defaults to calculated)
  const [costPrice, setCostPrice] = useState("")
  const [fixedExpenseRate, setFixedExpenseRate] = useState("")
  const [variableExpenseRate, setVariableExpenseRate] = useState("")

  // Product specific taxes
  const [icms, setIcms] = useState("")
  const [ipi, setIpi] = useState("")
  const [freight, setFreight] = useState("")
  const [otherCosts, setOtherCosts] = useState("")

  // Sales taxes
  const [pis, setPis] = useState("")
  const [cofins, setCofins] = useState("")

  // Funcionalidades de salvar e limpar
  const handleSaveCalculation = async () => {
    const selectedProduct = products.find(p => p.id === selectedProductId)
    if (!selectedProduct) {
      toast.error("Selecione um produto para salvar o cálculo")
      return
    }

    try {
      const calculationData = {
        id: currentCalculationId || undefined,
        calculationName: calculationName || `Cálculo ${Date.now()}`,
        productId: selectedProductId,
        productName: selectedProduct.name,
        costPrice: parseFloat(costPrice) || 0,
        markup: parseFloat(markup.toFixed(2)),
        suggestedPrice: parseFloat(suggestedPrice.toFixed(2)),
        totalCosts: totalCost,
        totalTaxes: totalTaxRate,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        desiredProfitMargin: parseFloat(desiredProfitMargin) || undefined,
        calculationData: {
          icms: parseFloat(icms) || 0,
          ipi: parseFloat(ipi) || 0,
          freight: parseFloat(freight) || 0,
          otherCosts: parseFloat(otherCosts) || 0,
          pis: parseFloat(pis) || 0,
          cofins: parseFloat(cofins) || 0,
          cpp: parseFloat(cpp) || 0,
          issqn: parseFloat(issqn) || 0,
          csll: parseFloat(csll) || 0,
          irpj: parseFloat(irpj) || 0,
          taxOthers: parseFloat(taxOthers) || 0
        }
      }
      
      const savedCalc = await saveCalculation(calculationData)
      
      toast.success('Cálculo salvo com sucesso!')

      // Limpar formulário após salvar
      setCurrentCalculationId(null)
      setSelectedProductId("")
      setCalculationName("")
      setCostPrice("")
      setDesiredProfitMargin("")
      setFixedExpenseRate("")
      setVariableExpenseRate("")
      setIcms("")
      setIpi("")
      setFreight("")
      setOtherCosts("")
      setPis("")
      setCofins("")
      setCpp("")
      setIssqn("")
      setCsll("")
      setIrpj("")
      setTaxOthers("")
    } catch (error: any) {
      console.error('Erro ao salvar cálculo:', error)
      toast.error(error.message || 'Erro ao salvar cálculo')
    }
  }

  const handleClearCalculation = () => {
    if (confirm('Deseja limpar todos os campos? Esta ação não pode ser desfeita.')) {
      // Limpar todos os campos
      setCurrentCalculationId(null)
      setSelectedProductId("")
      setCalculationName("")
      setCostPrice("")
      setDesiredProfitMargin("")
      setFixedExpenseRate("")
      setVariableExpenseRate("")
      setIcms("")
      setIpi("")
      setFreight("")
      setOtherCosts("")
      setPis("")
      setCofins("")
      setCpp("")
      setIssqn("")
      setCsll("")
      setIrpj("")
      setTaxOthers("")
    }
  }
  const [cpp, setCpp] = useState("")
  const [issqn, setIssqn] = useState("")
  const [csll, setCsll] = useState("")
  const [irpj, setIrpj] = useState("")
  const [taxOthers, setTaxOthers] = useState("")

  useEffect(() => {
    async function fetchData() {
      const [p, e, r, t] = await Promise.all([
        getProducts(),
        getExpenses(),
        getRevenues(),
        getTaxes()
      ])
      setProducts(p)
      setExpenses(e)
      setRevenues(r)
      setGlobalTaxes(t)
    }
    fetchData()
  }, [])

  // Carregar cálculo específico via URL parameter
  useEffect(() => {
    const loadCalculationId = searchParams.get('load')
    if (loadCalculationId) {
      const loadCalculationFromAPI = async () => {
        try {
          const calculation = await getCalculation(loadCalculationId)
          
          if (calculation) {
            // Carregar dados do cálculo nos campos
            setCalculationName(calculation.calculationName || "")
            setCostPrice(calculation.costPrice.toString())
            setDesiredProfitMargin(calculation.desiredProfitMargin?.toString() || "")
            setIcms(calculation.icms.toString())
            setIpi(calculation.ipi.toString())
            setFreight(calculation.freight.toString())
            setOtherCosts(calculation.otherCosts.toString())
            setPis(calculation.pis.toString())
            setCofins(calculation.cofins.toString())
            setCpp(calculation.cpp.toString())
            setIssqn(calculation.issqn.toString())
            setCsll(calculation.csll.toString())
            setIrpj(calculation.irpj.toString())
            setTaxOthers(calculation.taxOthers.toString())
            
            if (calculation.productId) {
              setSelectedProductId(calculation.productId)
            }
            
            setCurrentCalculationId(calculation.id)
            toast.success(`Cálculo de ${calculation.productName} carregado!`)
          } else {
            toast.error("Cálculo não encontrado")
          }
        } catch (error) {
          console.error("Erro ao carregar cálculo:", error)
          toast.error("Erro ao carregar cálculo")
        }
      }
      
      loadCalculationFromAPI()
    }
  }, [searchParams])

  useEffect(() => {
    if (productIdFromUrl && products.length > 0) {
      setSelectedProductId(productIdFromUrl)
    }
  }, [productIdFromUrl, products])

  // Calculate Global Rates based on Revenue
  const monthlyRevenue = useMemo(() => {
    return revenues
      .filter(rev => rev.period === 'monthly')
      .reduce((acc, curr) => acc + curr.value, 0)
  }, [revenues])

  const calculatedFixedRate = useMemo(() => {
    if (monthlyRevenue === 0) return 0
    const totalFixed = expenses.filter(e => e.type === 'fixed').reduce((acc, curr) => acc + curr.value, 0)
    return (totalFixed / monthlyRevenue) * 100
  }, [expenses, monthlyRevenue])

  const calculatedVariableRate = useMemo(() => {
    if (monthlyRevenue === 0) return 0
    const totalVariable = expenses.filter(e => e.type === 'variable').reduce((acc, curr) => acc + curr.value, 0)
    return (totalVariable / monthlyRevenue) * 100
  }, [expenses, monthlyRevenue])

  // Update form when product is selected
  useEffect(() => {
    // Helper to get global tax rate by type
    const getGlobalTax = (type: string) => {
      return globalTaxes
        .filter(t => t.type === type)
        .reduce((acc, curr) => acc + curr.rate, 0)
    }

    if (selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId)
      if (prod) {
        setCostPrice(prod.costPrice.toString())
        
        // For taxes: Use product specific if available, otherwise use global default
        // Note: If product has 0 saved, it might mean 0 tax or not set. 
        // Assuming if we are loading a product, we want to see what was saved for it.
        // BUT, the requirement says "everything input... must be added to the taxes already registered".
        // This implies the field should show the SUM.
        // However, usually "Product Tax" overrides "Global Tax".
        // Let's implement: Default to Global Tax. If Product has a value, use it?
        // Or: Pre-fill with Global Tax. User adds more.
        // Let's stick to standard behavior: Load Product values. If they are 0/null, maybe load global?
        // Actually, let's load the Global Taxes as the BASE for the fields if no product is selected.
        // If a product IS selected, we load its saved values.
        
        setIcms(prod.icms?.toString() || getGlobalTax('ICMS').toString())
        setIpi(prod.ipi?.toString() || "0") // IPI is usually value, not rate in this form? No, form says IPI (R$) but schema has rate? Wait.
        // Form has IPI (R$) in "Custos Adicionais". Schema has ipi Float.
        // Let's keep IPI as is for now.
        
        setFreight(prod.freight?.toString() || "0")
        setOtherCosts(prod.others?.toString() || "0")
        
        setPis(prod.pis?.toString() || getGlobalTax('PIS').toString())
        setCofins(prod.cofins?.toString() || getGlobalTax('COFINS').toString())
        setCpp(prod.cpp?.toString() || getGlobalTax('CPP').toString())
        setIssqn(prod.issqn?.toString() || getGlobalTax('ISSQN').toString())
        setCsll(prod.csll?.toString() || getGlobalTax('CSLL').toString())
        setIrpj(prod.irpj?.toString() || getGlobalTax('IRPJ').toString())
        setTaxOthers(prod.taxOthers?.toString() || getGlobalTax('OTHERS').toString())

        // If product already has a price, we could try to reverse calculate profit, 
        // but for now let's just set defaults for rates
        setFixedExpenseRate(calculatedFixedRate.toFixed(2))
        setVariableExpenseRate(calculatedVariableRate.toFixed(2))
      }
    } else {
      // No product selected: Load Global Defaults
      setCurrentCalculationId(null)
      setCalculationName("")
      setCostPrice("")
      
      setIcms(getGlobalTax('ICMS').toString())
      setPis(getGlobalTax('PIS').toString())
      setCofins(getGlobalTax('COFINS').toString())
      setCpp(getGlobalTax('CPP').toString())
      setIssqn(getGlobalTax('ISSQN').toString())
      setCsll(getGlobalTax('CSLL').toString())
      setIrpj(getGlobalTax('IRPJ').toString())
      setTaxOthers(getGlobalTax('OTHERS').toString())

      setIpi("")
      setFreight("")
      setOtherCosts("")
      setDesiredProfitMargin("")
    }
  }, [selectedProductId, products, calculatedFixedRate, calculatedVariableRate, globalTaxes])

  // Calculations
  const cost = parseFloat(costPrice) || 0
  const ipiVal = parseFloat(ipi) || 0
  const freightVal = parseFloat(freight) || 0
  const otherVal = parseFloat(otherCosts) || 0
  const totalCost = cost + ipiVal + freightVal + otherVal

  const fixedRate = parseFloat(fixedExpenseRate) || 0
  const variableRate = parseFloat(variableExpenseRate) || 0
  const icmsRate = parseFloat(icms) || 0

  const globalTaxRate = globalTaxes.reduce((acc, t) => acc + t.rate, 0)
  const pisRate = parseFloat(pis) || 0
  const cofinsRate = parseFloat(cofins) || 0
  const cppRate = parseFloat(cpp) || 0
  const issqnRate = parseFloat(issqn) || 0
  const csllRate = parseFloat(csll) || 0
  const irpjRate = parseFloat(irpj) || 0
  const taxOthersRate = parseFloat(taxOthers) || 0
  // Sum individual tax rates (as percentages of sales price)
  const totalTaxRate = icmsRate + pisRate + cofinsRate + cppRate + issqnRate + csllRate + irpjRate + taxOthersRate

  const profitMargin = parseFloat(desiredProfitMargin) || 0

  // Formula: SalesPrice = TotalCost / (1 - (TotalRates / 100))
  // TotalRates = Fixed + Variable + Taxes + Profit
  const totalDeductionsRate = fixedRate + variableRate + totalTaxRate + profitMargin

  let suggestedPrice = 0
  let markup = 0

  if (totalDeductionsRate < 100) {
    suggestedPrice = totalCost / (1 - (totalDeductionsRate / 100))
    if (totalCost > 0) {
      markup = suggestedPrice / totalCost // Or (SalesPrice - Cost) / Cost ? Usually Markup is multiplier or % added. 
      // Let's use Multiplier: Price = Cost * Markup -> Markup = Price / Cost
    }
  }

  const handleSave = async () => {
    if (!selectedProductId) {
      toast.error("Por favor, selecione um produto para salvar.")
      return
    }

    // Validar se o custo do produto foi informado
    if (!costPrice || parseFloat(costPrice) <= 0) {
      toast.error("Por favor, informe um custo válido para o produto.")
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      const selectedProduct = products.find(p => p.id === selectedProductId)
      if (!selectedProduct) {
        toast.error("Produto não encontrado.")
        return
      }

      console.log("Salvando produto:", selectedProductId)
      console.log("Dados do produto:", {
        name: selectedProduct.name,
        ncm: selectedProduct.ncm || "NCM será gerado automaticamente",
        costPrice: parseFloat(costPrice),
        markup: parseFloat(markup.toFixed(2)),
        salesPrice: parseFloat(suggestedPrice.toFixed(2)),
      })

      toast.loading("Salvando cálculo...")

      const updateData = {
        name: selectedProduct.name,
        ncm: selectedProduct.ncm || `${Math.floor(Math.random() * 90000000) + 10000000}`, // NCM aleatório de 8 dígitos
        costPrice: parseFloat(costPrice),
        markup: parseFloat(markup.toFixed(2)),
        salesPrice: parseFloat(suggestedPrice.toFixed(2)),
        icms: parseFloat(icms) || 0,
        ipi: parseFloat(ipi) || 0,
        freight: parseFloat(freight) || 0,
        others: parseFloat(otherCosts) || 0,
        pis: parseFloat(pis) || 0,
        cofins: parseFloat(cofins) || 0,
        cpp: parseFloat(cpp) || 0,
        issqn: parseFloat(issqn) || 0,
        csll: parseFloat(csll) || 0,
        irpj: parseFloat(irpj) || 0,
        taxOthers: parseFloat(taxOthers) || 0,
      }

      console.log("Dados para atualização:", updateData)

      await updateProduct(selectedProductId, updateData)

      // Refresh products
      const p = await getProducts()
      setProducts(p)

      toast.dismiss()
      toast.success("Preço salvo com sucesso!")
    } catch (e: any) {
      console.error("Erro ao salvar produto:", e)
      console.error("Stack trace:", e.stack)
      console.error("Erro detalhado:", JSON.stringify(e, null, 2))
      toast.dismiss()
      toast.error(`Erro ao salvar: ${e.message || 'Verifique os dados e tente novamente.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="calculator-animate-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">Calculadora de Markup</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Preencha os campos abaixo para determinar o markup ideal e o preço de venda sugerido para seus produtos.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 max-w-4xl space-y-6">
          {/* Seleção de Produto - Inline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calculationName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Cálculo</Label>
              <Input
                id="calculationName"
                value={calculationName}
                onChange={(e) => setCalculationName(e.target.value)}
                placeholder="Digite o nome do cálculo"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">&nbsp;</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent className="dark:bg-card dark:border-border">
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id} className="dark:text-gray-300 dark:focus:bg-muted">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custos e Despesas */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black dark:text-white">Custos e Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custo (R$)</Label>
                  <Input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Desp. Fixas</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={fixedExpenseRate}
                      onChange={(e) => setFixedExpenseRate(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Desp. Variáveis</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={variableExpenseRate}
                      onChange={(e) => setVariableExpenseRate(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tributos</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={totalTaxRate.toFixed(2)}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              {/* Segunda linha - Custos Adicionais */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">IPI (R$)</Label>
                  <Input
                    type="number"
                    value={ipi}
                    onChange={(e) => setIpi(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Frete (R$)</Label>
                  <Input
                    type="number"
                    value={freight}
                    onChange={(e) => setFreight(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Outros (R$)</Label>
                  <Input
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-violet-600 dark:text-violet-400 border-l-4 border-violet-600 dark:border-violet-400 pl-3">Total Custo</Label>
                  <Input
                    type="number"
                    value={totalCost.toFixed(2)}
                    readOnly
                    className="bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100 font-semibold text-base"
                  />
                </div>
              </div>
              
              {/* Linha de Impostos */}
              <div className="space-y-4 pt-6">
                <h4 className="text-base font-medium text-violet-600 dark:text-violet-400">Impostos sobre a Venda</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Icms</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={icms}
                        onChange={e => setIcms(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pis</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={pis}
                        onChange={e => setPis(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cofins</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={cofins}
                        onChange={e => setCofins(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">CPP</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={cpp}
                        onChange={e => setCpp(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issqn</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={issqn}
                        onChange={e => setIssqn(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Csll</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={csll}
                        onChange={e => setCsll(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Irpj</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={irpj}
                        onChange={e => setIrpj(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Outros</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={taxOthers}
                        onChange={e => setTaxOthers(e.target.value)}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margem de Lucro */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-black dark:text-white">Margem de Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Lucro Desejado</Label>
                  <div className="relative">
                    <Input
                      placeholder="%"
                      type="number"
                      value={desiredProfitMargin}
                      onChange={(e) => setDesiredProfitMargin(e.target.value)}
                      className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 pr-8 text-black dark:text-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Faturamento</Label>
                  <div className="relative">
                    <Input
                      placeholder="R$"
                      type="text"
                      value={monthlyRevenue > 0 ? `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Não cadastrado'}
                      className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      readOnly
                      title={monthlyRevenue > 0 ? `Faturamento mensal: R$ ${monthlyRevenue.toFixed(2)}` : 'Cadastre o faturamento em Custos e Impostos'}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            
            
          </div>
        </div>

        {/* Resultado Final */}
        <div className="xl:w-96 xl:min-w-96 space-y-6">
          <div className="calculator-animate-in">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resultado Final</h3>
                </div>

                {/* Markup Section */}
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Markup</p>
                  <p className="text-6xl font-bold text-violet-600 dark:text-violet-400 mb-2">
                    {markup.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Índice multiplicador aplicado sobre o custo.</p>
                </div>

                {/* Price Section */}
                <div className="text-center py-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Preço de Venda Sugerido</p>
                  <p className="text-4xl font-bold text-green-500 dark:text-green-400 mb-2">
                    R$ {suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Valor final para o consumidor.</p>
                </div>

                {/* Composition Section */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-4">Composição do Preço:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Custo do Produto: R$ {cost.toFixed(2)} ({((cost / suggestedPrice) * 100 || 0).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Impostos e Despesas: R$ {(suggestedPrice * ((fixedRate + variableRate + totalTaxRate) / 100) || 0).toFixed(2)} ({(fixedRate + variableRate + totalTaxRate).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Lucro Bruto: R$ {(suggestedPrice * (profitMargin / 100) || 0).toFixed(2)} ({profitMargin.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveCalculation}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-700 dark:text-white !text-white transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                    style={{color: 'white'}}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Salvar Cálculo
                  </Button>
                  <Button 
                    onClick={handleClearCalculation}
                    variant="outline" 
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-200 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarkupCalculator() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MarkupCalculatorContent />
    </Suspense>
  )
}
