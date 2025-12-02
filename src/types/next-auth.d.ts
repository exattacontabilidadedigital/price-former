import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string | null
            email: string
            role: string
            companyId: string | null
            company?: {
                id: string
                name: string
                fantasyName: string | null
                cnpj: string | null
                logoUrl: string | null
            }
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
        name: string | null
        email: string
        role: string
        companyId: string | null
        company?: {
            id: string
            name: string
            fantasyName: string | null
            cnpj: string | null
            logoUrl: string | null
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string
        name: string | null
        email: string
        role: string
        companyId: string | null
        company?: {
            id: string
            name: string
            fantasyName: string | null
            cnpj: string | null
            logoUrl: string | null
        }
    }
}
