import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const companySchema = z.object({
    name: z.string().min(1, 'Nome da empresa é obrigatório'),
    fantasyName: z.string().optional(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { companyId: true },
        });

        if (!user?.companyId) {
            return NextResponse.json(
                { error: 'Usuário não possui empresa associada' },
                { status: 404 }
            );
        }

        const company = await prisma.company.findUnique({
            where: { id: user.companyId },
        });

        if (!company) {
            return NextResponse.json(
                { error: 'Empresa não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados da empresa' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { companyId: true },
        });

        if (!user?.companyId) {
            return NextResponse.json(
                { error: 'Usuário não possui empresa associada' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validationResult = companySchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, fantasyName, cnpj, address } = validationResult.data;

        const updatedCompany = await prisma.company.update({
            where: { id: user.companyId },
            data: { name, fantasyName, cnpj, address },
        });

        return NextResponse.json({
            company: updatedCompany,
            message: 'Empresa atualizada com sucesso',
        });
    } catch (error) {
        console.error('Error updating company:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar empresa' },
            { status: 500 }
        );
    }
}
