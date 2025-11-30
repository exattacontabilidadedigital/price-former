import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const inviteUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    role: z.enum(['USER', 'ADMIN']).refine((val) => ['USER', 'ADMIN'].includes(val), {
        message: 'Role inválido',
    }),
});

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { companyId: true },
        });

        if (!currentUser?.companyId) {
            return NextResponse.json([]);
        }

        const users = await prisma.user.findMany({
            where: { companyId: currentUser.companyId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar usuários' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { companyId: true, role: true },
        });

        if (!currentUser?.companyId) {
            return NextResponse.json(
                { error: 'Você não possui empresa associada' },
                { status: 400 }
            );
        }

        // Only ADMIN can invite users
        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem convidar usuários' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validationResult = inviteUserSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, role } = validationResult.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Usuário já existe com este email' },
                { status: 400 }
            );
        }

        // Generate temporary password (user should change it on first login)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                companyId: currentUser.companyId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            user: newUser,
            tempPassword, // In production, send this via email
            message: 'Usuário convidado com sucesso',
        });
    } catch (error) {
        console.error('Error inviting user:', error);
        return NextResponse.json(
            { error: 'Erro ao convidar usuário' },
            { status: 500 }
        );
    }
}
