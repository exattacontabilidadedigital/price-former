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
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
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

  // Input State
  const [desiredProfitMargin, setDesiredProfitMargin] = useState("")

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

  useEffect(() => {
    if (productIdFromUrl && products.length > 0) {
      setSelectedProductId(productIdFromUrl)
    }
  }, [productIdFromUrl, products])

  // Calculate Global Rates based on Revenue
  const monthlyRevenue = useMemo(() => {
    const r = revenues.find(rev => rev.period === 'monthly')
    return r ? r.value : 0
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
    if (selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId)
      if (prod) {
        setCostPrice(prod.costPrice.toString())
        setIcms(prod.icms?.toString() || "0")
        setIpi(prod.ipi?.toString() || "0")
        setFreight(prod.freight?.toString() || "0")
        setOtherCosts(prod.others?.toString() || "0")
        setPis(prod.pis?.toString() || "0")
        setCofins(prod.cofins?.toString() || "0")
        setCpp(prod.cpp?.toString() || "0")
        setIssqn(prod.issqn?.toString() || "0")
        setCsll(prod.csll?.toString() || "0")
        setIrpj(prod.irpj?.toString() || "0")
        setTaxOthers(prod.taxOthers?.toString() || "0")

        // If product already has a price, we could try to reverse calculate profit, 
        // but for now let's just set defaults for rates
        setFixedExpenseRate(calculatedFixedRate.toFixed(2))
        setVariableExpenseRate(calculatedVariableRate.toFixed(2))
      }
    } else {
      setCostPrice("")
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
      setDesiredProfitMargin("")
    }
  }, [selectedProductId, products, calculatedFixedRate, calculatedVariableRate])

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
        ncm: selectedProduct.ncm,
        costPrice: parseFloat(costPrice),
        markup: parseFloat(markup.toFixed(2)),
        salesPrice: parseFloat(suggestedPrice.toFixed(2)),
      })

      toast.loading("Salvando cálculo...")

      await updateProduct(selectedProductId, {
        name: selectedProduct.name,
        ncm: selectedProduct.ncm,
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
      })

      // Refresh products
      const p = await getProducts()
      setProducts(p)

      toast.dismiss()
      toast.success("Preço salvo com sucesso!")
    } catch (e) {
      console.error("Erro ao salvar produto:", e)
      toast.dismiss()
      toast.error("Erro ao salvar. Verifique os dados e tente novamente.")
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
              <Label htmlFor="productName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Produto</Label>
              <Input
                id="productName"
                placeholder="Digite o nome do produto"
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
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Outros Custos (R$)</Label>
                  <Input
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(e.target.value)}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white focus:border-violet-500 dark:focus:border-violet-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Custo</Label>
                  <Input
                    type="number"
                    value={totalCost.toFixed(2)}
                    readOnly
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
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
                      placeholder="%"
                      type="number"
                      className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pr-8 text-gray-600 dark:text-gray-400"
                      readOnly
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={!selectedProductId || !costPrice || parseFloat(costPrice) <= 0 || isLoading} 
              className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Cálculo"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedProductId("")
                setIsLoading(false)
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium py-3"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Resultado Final */}
        <div className="xl:w-96 xl:min-w-96 space-y-6">
          <div className="calculator-animate-in">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Resultado Final</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resumo geral da performance de preços e lucratividade</p>
            </div>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Markup</p>
                  <p className="text-5xl font-bold text-violet-600 dark:text-violet-400">
                    {markup.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Índice multiplicador aplicado sobre o custo</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Preço de Venda Sugerido</p>
                    <p className="text-3xl font-bold text-green-500 dark:text-green-400">
                      R$ {suggestedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Valor final para o consumidor</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-4">Composição do Preço</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-blue-400 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">Custo do Produto: R$ {cost.toFixed(2)} ({((cost / suggestedPrice) * 100 || 0).toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-orange-400 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">Impostos e Despesas: R$ {(suggestedPrice * ((fixedRate + variableRate + totalTaxRate) / 100) || 0).toFixed(2)} ({(fixedRate + variableRate + totalTaxRate).toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded bg-green-400 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">Lucro Bruto: R$ {(suggestedPrice * (profitMargin / 100) || 0).toFixed(2)} ({profitMargin.toFixed(1)}%)</span>
                      </div>
                    </div>
                  </div>
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
