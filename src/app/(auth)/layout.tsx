import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Price Former - Precificação Inteligente",
    description: "Sistema de precificação para o seu negócio",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            {children}
        </>
    )
}
