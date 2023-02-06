import { resolvers } from '../Resolvers';
import { createMockContext } from './mockContext';

const createTask = resolvers.Mutation?.createTask as Function;

describe('createTask', () => {
    it('adds tasks to the first status', async () => {
        const context = createMockContext();
        context.prisma.board.findFirstOrThrow.mockResolvedValue({
            statuses: [
                { ordering: 1, id: 400 },
                { ordering: 2, id: 200 },
                { ordering: 0, id: 100 },
            ]
        } as any);

        await createTask(undefined, { boardId: 1, newTask: { text: 'Test' } }, context);
        const { calls } = context.prisma.task.create.mock;
        const [args] = calls[0];

        expect(args.data.statusId).toEqual(100);
    });

    it('can add tasks when below limit', async () => {
        const context = createMockContext();
        context.prisma.board.findFirstOrThrow.mockResolvedValue({
            statuses: [
                { ordering: 0, id: 100, limit: 5, tasks: [{}, {}, {}, {}] },
            ]
        } as any);

        await createTask(undefined, { boardId: 1, newTask: { text: 'Test' } }, context);

    });

    it('cannot add tasks when at limit', async () => {
        const context = createMockContext();
        context.prisma.board.findFirstOrThrow.mockResolvedValue({
            statuses: [
                { ordering: 0, id: 100, limit: 5, tasks: [{}, {}, {}, {}, {}] },
            ]
        } as any);

        expect(createTask(undefined, { boardId: 1, newTask: { text: 'Test' } }, context))
            .rejects
            .toThrow("Limit Reached");
    });

    it('can add when limit is zero', async () => {
        const context = createMockContext();
        context.prisma.board.findFirstOrThrow.mockResolvedValue({
            statuses: [
                { ordering: 0, id: 100, limit: 0, tasks: [{}] },
            ]
        } as any);

        await createTask(undefined, { boardId: 1, newTask: { text: 'NewTest' } }, context);
        const { calls } = context.prisma.task.create.mock;
        const [args] = calls[0];

        expect(args.data.text).toEqual('NewTest');
    });
});