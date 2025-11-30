import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true }
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const dbUser = await getUser(email);
                    if (!dbUser) return null;
                    const passwordsMatch = await bcrypt.compare(password, dbUser.password);

                    if (passwordsMatch) {
                        // Map Prisma user to NextAuth User
                        return {
                            id: dbUser.id,
                            name: dbUser.name,
                            email: dbUser.email,
                            role: dbUser.role,
                            companyId: dbUser.companyId,
                            company: dbUser.company ? {
                                id: dbUser.company.id,
                                name: dbUser.company.name,
                                fantasyName: dbUser.company.fantasyName,
                                cnpj: dbUser.company.cnpj,
                                logoUrl: dbUser.company.logoUrl,
                            } : undefined
                        };
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // On sign in, populate token with user data
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
                token.companyId = user.companyId;

                // Include company data if available
                if (user.company) {
                    token.company = {
                        id: user.company.id,
                        name: user.company.name,
                        fantasyName: user.company.fantasyName,
                        cnpj: user.company.cnpj,
                        logoUrl: user.company.logoUrl,
                    };
                }
            }

            // On update, fetch fresh data from database
            if (trigger === "update") {
                console.log("Session update triggered");
                // Use email from token if available
                const email = token.email as string;

                if (email) {
                    try {
                        const freshUser = await prisma.user.findUnique({
                            where: { email },
                            include: { company: true },
                        });

                        if (freshUser) {
                            console.log("Fresh user data fetched:", freshUser.company?.name);
                            token.id = freshUser.id;
                            token.name = freshUser.name;
                            token.email = freshUser.email;
                            token.role = freshUser.role;
                            token.companyId = freshUser.companyId;
                            token.company = freshUser.company ? {
                                id: freshUser.company.id,
                                name: freshUser.company.name,
                                fantasyName: freshUser.company.fantasyName,
                                cnpj: freshUser.company.cnpj,
                                logoUrl: freshUser.company.logoUrl,
                            } : undefined;
                        }
                    } catch (error) {
                        console.error("Error refreshing session:", error);
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string | null;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.companyId = token.companyId as string | null;
                session.user.company = token.company as {
                    id: string;
                    name: string;
                    fantasyName: string | null;
                    cnpj: string | null;
                    logoUrl: string | null;
                } | undefined;
            }
            return session;
        },
    },
});
