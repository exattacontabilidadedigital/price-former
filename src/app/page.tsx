import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/80 dark:backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                            <span className="text-lg font-bold text-white">PF</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Price Former</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-900 dark:text-gray-300">
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
                <section className="relative py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100/50 via-white to-violet-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                    
                    <div className="container mx-auto px-4 md:px-6 text-center relative">
                        <div className="inline-flex items-center rounded-full border border-violet-600 bg-violet-600 px-3 py-1 text-sm font-medium text-white mb-8 shadow-lg shadow-violet-600/20">
                            <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></span>
                            Nova versão disponível
                        </div>
                        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Precificação Inteligente para o seu Negócio
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Calcule markup, margem de lucro e impostos de forma simples e precisa. Tome decisões baseadas em dados e aumente sua lucratividade com nossa plataforma completa.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="h-14 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-105">
                                    Começar Agora Grátis
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-violet-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-md">
                                    Ver Demonstração
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Stats or Social Proof */}
                        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-gray-200/60 pt-8 dark:border-gray-800/60">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">+1000</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Produtos Cadastrados</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ 5M+</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Em Vendas Gerenciadas</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">99%</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Precisão nos Cálculos</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">24/7</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Suporte Especializado</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-white dark:bg-gray-950 relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">Tudo que você precisa para precificar corretamente</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Ferramentas poderosas desenvolvidas por especialistas para garantir a saúde financeira do seu negócio.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Cálculo de Markup",
                                    desc: "Defina seu markup ideal considerando todos os custos e despesas.",
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
                                },
                                {
                                    title: "Gestão de Impostos",
                                    desc: "Configure ICMS, IPI, PIS/COFINS e outros impostos de forma automática.",
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent"><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>
                                },
                                {
                                    title: "Dashboard Intuitivo",
                                    desc: "Visualize seus lucros, custos e margens em tempo real.",
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                                },
                                {
                                    title: "Relatórios Detalhados",
                                    desc: "Exporte dados e analise a performance de cada produto.",
                                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
                                }
                            ].map((feature, index) => (
                                <div key={index} className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-violet-900/50 dark:hover:shadow-none">
                                    <div className="h-14 w-14 rounded-xl bg-violet-50 shadow-sm border border-violet-100 flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-violet-400 dark:group-hover:bg-violet-600 dark:group-hover:text-white">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">Planos Simples e Transparentes</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">Escolha o plano ideal para o tamanho do seu negócio. Sem taxas escondidas.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Free Plan */}
                            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-950">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gratuito</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">Para quem está começando.</p>
                                <div className="my-8">
                                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">R$ 0</span>
                                    <span className="text-gray-700 dark:text-gray-400 font-medium">/mês</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    {[
                                        "Até 10 produtos",
                                        "Cálculo de Markup básico",
                                        "Dashboard simples",
                                        "Suporte por email"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-900 dark:text-gray-300">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-600 flex items-center justify-center dark:bg-green-500">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register" className="mt-auto">
                                    <Button className="w-full h-12 text-base font-medium" variant="outline">Começar Grátis</Button>
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="flex flex-col rounded-2xl border-2 border-violet-600 bg-white p-8 shadow-2xl shadow-violet-200/50 relative transform md:-translate-y-4 dark:bg-gray-900 dark:shadow-none">
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                                    Mais Popular
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profissional</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">Para negócios em crescimento.</p>
                                <div className="my-8">
                                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">R$ 49</span>
                                    <span className="text-gray-700 dark:text-gray-400 font-medium">/mês</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    {[
                                        "Produtos ilimitados",
                                        "Cálculo avançado de impostos",
                                        "Relatórios detalhados",
                                        "Suporte prioritário",
                                        "Exportação em CSV",
                                        "Múltiplos usuários"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-900 dark:text-gray-200 font-medium">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center dark:bg-violet-500">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register" className="mt-auto">
                                    <Button className="w-full h-12 text-base font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 transition-all hover:scale-105 hover:shadow-violet-600/40">Assinar Agora</Button>
                                </Link>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all dark:border-gray-800 dark:bg-gray-950">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Empresarial</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-400">Para grandes operações.</p>
                                <div className="my-8">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">Sob Consulta</span>
                                </div>
                                <ul className="mb-8 space-y-4 flex-1">
                                    {[
                                        "Tudo do plano Pro",
                                        "API dedicada",
                                        "Gestor de conta",
                                        "Treinamento personalizado",
                                        "SLA garantido",
                                        "Setup assistido"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-900 dark:text-gray-300">
                                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-600 flex items-center justify-center dark:bg-gray-500">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/register" className="mt-auto">
                                    <Button className="w-full h-12 text-base font-medium" variant="outline">Falar com Vendas</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-950 py-12 dark:border-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-600">
                                    <span className="text-xs font-bold text-white">PF</span>
                                </div>
                                <span className="text-lg font-bold text-white">Price Former</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Simplificando a precificação para empreendedores em todo o Brasil.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Produto</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-violet-400">Funcionalidades</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Preços</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Integrações</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Changelog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Empresa</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-violet-400">Sobre nós</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Carreiras</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Blog</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Contato</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="#" className="hover:text-violet-400">Privacidade</Link></li>
                                <li><Link href="#" className="hover:text-violet-400">Termos de Uso</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} Price Former. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    )
}
