import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'jest-mock-extended'
import { NextApiRequest, NextApiResponse } from 'next';

export const createMockContext = () => {
    return {
        req: mockDeep<NextApiRequest>(),
        res: mockDeep<NextApiResponse>(),
        prisma: mockDeep<PrismaClient>(),
    }
}