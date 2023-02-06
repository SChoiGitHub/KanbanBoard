import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next/types';

const prisma = new PrismaClient()

interface OriginalContextType {
    req: NextApiRequest,
    res: NextApiResponse,
}

export type ContextType = {
    req: NextApiRequest,
    res: NextApiResponse,
    prisma: PrismaClient,
};


export const buildContext = async (originalContext: OriginalContextType): Promise<ContextType> => {
    return { prisma, ...originalContext };
};

