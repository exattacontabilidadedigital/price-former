import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
});

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validationResult = updateUserSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email } = validationResult.data;

        // Check if email is already taken by another user
        if (email !== session.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Este email já está em uso' },
                    { status: 400 }
                );
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: { name, email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
            },
        });

        return NextResponse.json({
            user: updatedUser,
            message: 'Perfil atualizado com sucesso',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar perfil' },
            { status: 500 }
        );
    }
}
