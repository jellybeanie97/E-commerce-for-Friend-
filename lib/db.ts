import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const prismaClientSingleton = () =>
{
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
    return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as typeof globalThis & 
{
    prisma: PrismaClientSingleton | undefined
}

export const db = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db