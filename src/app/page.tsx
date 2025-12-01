import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                            <span className="text-lg font-bold text-white">PF</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Price Former</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="#features" className="hover:text-violet-600 dark:hover:text-violet-400">Funcionalidades</Link>
                        <Link href="#pricing" className="hover:text-violet-600 dark:hover:text-violet-400">Preços</Link>
                        <Link href="#about" className="hover:text-violet-600 dark:hover:text-violet-400">Sobre</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400">
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                                Começar Grátis
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                            Precificação Inteligente para o seu Negócio
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Calcule markup, margem de lucro e impostos de forma simples e precisa. Tome decisões baseadas em dados e aumente sua lucratividade.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="h-12 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white">
                                    Começar Agora
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                    Ver Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Tudo que você precisa para precificar corretamente</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Ferramentas poderosas para garantir a saúde financeira do seu negócio.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm dark:bg-gray-950">
                                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 mb-4 dark:bg-violet-900/20 dark:text-violet-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cálculo de Markup</h3>
                                <p className="text-gray-500 dark:text-gray-400">Defina seu markup ideal considerando todos os custos e despesas.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm dark:bg-gray-950">
                                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 mb-4 dark:bg-violet-900/20 dark:text-violet-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent"><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gestão de Impostos</h3>
                                <p className="text-gray-500 dark:text-gray-400">Configure ICMS, IPI, PIS/COFINS e outros impostos de forma automática.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm dark:bg-gray-950">
                                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 mb-4 dark:bg-violet-900/20 dark:text-violet-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dashboard Intuitivo</h3>
                                <p className="text-gray-500 dark:text-gray-400">Visualize seus lucros, custos e margens em tempo real.</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm dark:bg-gray-950">
                                <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 mb-4 dark:bg-violet-900/20 dark:text-violet-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Relatórios Detalhados</h3>
                                <p className="text-gray-500 dark:text-gray-400">Exporte dados e analise a performance de cada produto.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Planos Simples e Transparentes</h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Escolha o plano ideal para o tamanho do seu negócio.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Free Plan */}
                            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gratuito</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Para quem está começando.</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
                                    <span className="text-gray-500 dark:text-gray-400">/mês</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Até 10 produtos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Cálculo de Markup básico</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Dashboard simples</span>
                                    </li>
                                </ul>
                                <Link href="/register">
                                    <Button className="w-full" variant="outline">Começar Grátis</Button>
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="flex flex-col rounded-2xl border-2 border-violet-600 bg-white p-8 shadow-lg relative dark:bg-gray-900">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-sm font-medium text-white">
                                    Mais Popular
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profissional</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Para negócios em crescimento.</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 49</span>
                                    <span className="text-gray-500 dark:text-gray-400">/mês</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Produtos ilimitados</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Cálculo avançado de impostos</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Relatórios detalhados</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Suporte prioritário</span>
                                    </li>
                                </ul>
                                <Link href="/register">
                                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">Assinar Agora</Button>
                                </Link>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Empresarial</h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">Para grandes operações.</p>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">Sob Consulta</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Tudo do plano Pro</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>API dedicada</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Gestor de conta</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Check className="h-5 w-5 text-violet-600" />
                                        <span>Treinamento personalizado</span>
                                    </li>
                                </ul>
                                <Link href="/register">
                                    <Button className="w-full" variant="outline">Falar com Vendas</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-950">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-600">
                                    <span className="text-xs font-bold text-white">PF</span>
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Price Former</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Simplificando a precificação para empreendedores em todo o Brasil.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Produto</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><Link href="#" className="hover:text-violet-600">Funcionalidades</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Preços</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Integrações</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Changelog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Empresa</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><Link href="#" className="hover:text-violet-600">Sobre nós</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Carreiras</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Blog</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Contato</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><Link href="#" className="hover:text-violet-600">Privacidade</Link></li>
                                <li><Link href="#" className="hover:text-violet-600">Termos de Uso</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        © {new Date().getFullYear()} Price Former. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    )
}
