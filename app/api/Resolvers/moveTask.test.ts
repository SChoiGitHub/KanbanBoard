import { resolvers } from '../Resolvers';
import { createMockContext } from './mockContext';

const moveTask = resolvers.Mutation?.moveTask as Function;

describe('moveTask', () => {
    it('does not succeed if limit would be exceeded', async () => {
        const context = createMockContext();
        context.prisma.status.findFirstOrThrow.mockReturnValueOnce({
            limit: 3,
            tasks: [{}, {}, {}],
        } as any)

        expect(moveTask(undefined, { boardId: 1, newStatusId: 9999 }, context))
            .rejects
            .toThrow(/Limit Reached/);
    });

    it('moves the task if it is within limits', async () => {
        const context = createMockContext();
        context.prisma.status.findFirstOrThrow.mockReturnValueOnce({
            limit: 4,
            tasks: [{}, {}, {}],
        } as any)

        await moveTask(undefined, { taskId: 2, newStatusId: 10000 }, context);
        const { calls } = context.prisma.task.update.mock;
        const [updateParameters] = calls[0];

        expect(updateParameters.where).toEqual({ id: 2 });        
        expect(updateParameters.data).toEqual({ statusId: 10000 });
    });

    it('finds the correct new status', async () => {
        const context = createMockContext();
        context.prisma.status.findFirstOrThrow.mockReturnValueOnce({
            limit: 4,
            tasks: [{}, {}, {}],
        } as any)

        await moveTask(undefined, { taskId: 4, newStatusId: 12345 }, context);
        const { calls } = context.prisma.status.findFirstOrThrow.mock;
        const [findParameters] = calls[0];

        expect(findParameters?.where).toEqual({ id: 12345 });        
        expect(findParameters?.include).toEqual({ tasks: true });
    });
});