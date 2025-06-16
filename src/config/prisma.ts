import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma has been initted');

export { prisma };
