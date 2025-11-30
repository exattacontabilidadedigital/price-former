

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, Bell } from "lucide-react"
import { getDashboardMetrics } from "@/app/actions/dashboard-actions"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { CompositionChart } from "@/components/dashboard/composition-chart"
import { ProductPerformanceChart } from "@/components/dashboard/product-performance-chart"

export default async function DashboardPage() {
    const metrics = await getDashboardMetrics()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight dashboard-title">Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400">Resumo geral da performace de preços e lucratividade.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="default" className="bg-violet-600 hover:bg-violet-700 !text-white text-xs h-8 dark:bg-violet-600 dark:hover:bg-violet-700 dark:!text-white">Hoje</Button>
                    <Button variant="outline" className="text-gray-900 text-xs h-8 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-muted">Últimos 7 Dias</Button>
                    <Button variant="outline" className="text-gray-900 text-xs h-8 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-muted">Este Mês</Button>
                    <Button variant="outline" className="text-gray-900 text-xs h-8 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-muted">Este Ano</Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Markup Médio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="main-value-black text-xl sm:text-2xl font-bold truncate" title={`${metrics.averageMarkup.toFixed(2)}x`}>{metrics.averageMarkup.toFixed(2)}x</div>
                        <p className="text-xs text-green-500 flex items-center font-medium">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            +0.0%
                        </p>
                    </CardContent>
                </Card>
                <Card className="dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Faturamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="main-value-black text-xl sm:text-2xl font-bold truncate" title={`R$ ${metrics.totalBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}>R$ {metrics.totalBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-green-500 flex items-center font-medium">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            +0.0%
                        </p>
                    </CardContent>
                </Card>
                <Card className="dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="main-value-black text-xl sm:text-2xl font-bold truncate" title={`R$ ${metrics.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}>R$ {metrics.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-gray-500 flex items-center font-medium">
                            {metrics.totalBilling > 0
                                ? `${((metrics.totalExpenses / metrics.totalBilling) * 100).toFixed(1)}% do Faturamento`
                                : "0.0% do Faturamento"}
                        </p>
                    </CardContent>
                </Card>
                <Card className="dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Produtos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="main-value-black text-xl sm:text-2xl font-bold truncate">{metrics.totalProducts}</div>
                        <p className="text-xs text-gray-500 flex items-center font-medium">
                            Cadastrados
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold card-title-black">Performance de Produtos (Markup)</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Produtos com maior margem de lucro</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ProductPerformanceChart data={metrics.topProducts} />
                        {metrics.topProducts.length > 0 && (
                            <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800">
                                <p className="text-sm text-violet-800 dark:text-violet-300 font-medium">
                                    💡 Insight: O produto <strong>{metrics.topProducts[0].name}</strong> tem o maior markup ({metrics.topProducts[0].value.toFixed(2)}x).
                                    Focar em vendas deste item pode aumentar significativamente sua lucratividade.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3 dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base font-semibold card-title-black">Top Produtos por Markup</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Maiores Margens</p>
                        </div>
                        <Bell className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 mt-4">
                            {metrics.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="product-name-black w-24 truncate" title={product.name}>{product.name}</span>
                                    <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-muted">
                                        <div
                                            className={`h-full ${product.color} rounded-full`}
                                            style={{ width: `${Math.min(product.value * 20, 100)}%` }} // Visual approximation
                                        />
                                    </div>
                                    <span className="product-name-black font-medium">{product.value.toFixed(2)}x</span>
                                </div>
                            ))}
                            {metrics.topProducts.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4 dark:bg-card dark:border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold card-title-black">Produtos com Baixo Markup</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Itens que precisam de atenção na precificação.</p>
                        </div>
                        <Button variant="link" className="text-blue-500 text-sm font-medium">Ver Todos</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="min-w-[500px] space-y-4">
                                <div className="grid grid-cols-4 text-xs font-medium text-gray-400 uppercase tracking-wider dark:text-gray-500">
                                    <div>Produto</div>
                                    <div>Markup Atual</div>
                                    <div>Markup Sugerido</div>
                                    <div className="text-right">Ação</div>
                                </div>
                                {metrics.lowMarkupProducts.map((product, index) => (
                                    <div key={index} className="grid grid-cols-4 text-sm items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0 dark:border-border">
                                        <div className="product-name-black font-medium truncate">{product.name}</div>
                                        <div className="text-red-500 font-medium">{product.current.toFixed(2)}x</div>
                                        <div className="text-gray-500 dark:text-gray-400">{product.suggested.toFixed(2)}x</div>
                                        <div className="text-right">
                                            <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 h-auto p-0 font-medium dark:hover:bg-muted">Ajustar</Button>
                                        </div>
                                    </div>
                                ))}
                                {metrics.lowMarkupProducts.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">Nenhum produto com markup baixo encontrado</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 dark:bg-card dark:border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold card-title-black">Composição do Preço</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Média geral</p>
                    </CardHeader>
                    <CardContent>
                        <CompositionChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
