import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    role: z.enum(['USER', 'ADMIN']),
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // Only ADMIN can edit users
        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem editar usuários' },
                { status: 403 }
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

        const { name, email, role } = validationResult.data;

        // Check if user exists and belongs to the same company
        const userToUpdate = await prisma.user.findUnique({
            where: { id },
        });

        if (!userToUpdate) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        if (userToUpdate.companyId !== currentUser.companyId) {
            return NextResponse.json(
                { error: 'Você não pode editar usuários de outra empresa' },
                { status: 403 }
            );
        }

        // Check if new email is already taken by another user
        if (email !== userToUpdate.email) {
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

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            user: updatedUser,
            message: 'Usuário atualizado com sucesso',
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar usuário' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, companyId: true, role: true },
        });

        if (!currentUser?.companyId) {
            return NextResponse.json(
                { error: 'Você não possui empresa associada' },
                { status: 400 }
            );
        }

        // Only ADMIN can delete users
        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem excluir usuários' },
                { status: 403 }
            );
        }

        // Check if user exists and belongs to the same company
        const userToDelete = await prisma.user.findUnique({
            where: { id },
        });

        if (!userToDelete) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        if (userToDelete.companyId !== currentUser.companyId) {
            return NextResponse.json(
                { error: 'Você não pode excluir usuários de outra empresa' },
                { status: 403 }
            );
        }

        // Prevent self-deletion
        if (userToDelete.id === currentUser.id) {
            return NextResponse.json(
                { error: 'Você não pode excluir sua própria conta' },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({
            message: 'Usuário excluído com sucesso',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir usuário' },
            { status: 500 }
        );
    }
}
