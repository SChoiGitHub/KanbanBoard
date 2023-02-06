import { resolvers } from '../Resolvers';
import { UpdateStatusInput } from '../__gql__/server';
import { createMockContext } from './mockContext';

const updateStatus = resolvers.Mutation?.updateStatus as Function;

describe('updateStatus', () => {
    it('can update a single field at a time', async () => {
        const context = createMockContext();
        const newValues = { title: 'newName' } as UpdateStatusInput;

        await updateStatus(undefined, { id: 1234, newValues }, context);
        const { calls } = context.prisma.status.update.mock;
        const [args] = calls[0];

        expect(args.where).toEqual({ id: 1234 });
        expect(args.data.title).toEqual('newName');
        expect(args.data.limit).toBeUndefined();
    });

    it('can update multiple fields at a time', async () => {
        const context = createMockContext();
        const newValues = { title: 'newName', limit: 404 } as UpdateStatusInput;

        await updateStatus(undefined, { id: 1234, newValues }, context);
        const { calls } = context.prisma.status.update.mock;
        const [args] = calls[0];

        expect(args.where).toEqual({ id: 1234 });
        expect(args.data.title).toEqual('newName');
        expect(args.data.limit).toEqual(404);
    });
});