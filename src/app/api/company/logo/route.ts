import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user from DB to get reliable companyId
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { companyId: true }
        });

        if (!user?.companyId) {
            return NextResponse.json({ error: "User has no company" }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore if already exists
        }

        // Generate unique filename
        const filename = `${randomUUID()}${path.extname(file.name)}`;
        const filepath = path.join(uploadDir, filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        // Update company with logo URL
        const logoUrl = `/uploads/${filename}`;
        const company = await prisma.company.update({
            where: { id: user.companyId },
            data: { logoUrl },
        });

        return NextResponse.json({ logoUrl, company });
    } catch (error) {
        console.error("Error uploading logo:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
