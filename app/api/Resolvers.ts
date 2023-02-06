import { Status, Task } from "@prisma/client";
import { GraphQLError } from "graphql";
import { ContextType } from "./Context";
import { Resolvers } from "./__gql__/server";


const checkIfTaskCanBeAddedTo = (status: Status & { tasks: Task[]; }) => {
    if (status.limit > 0 && status.limit <= status.tasks.length) {
        throw new GraphQLError("Limit Reached");
    }
}

export const resolvers: Resolvers<ContextType> = {
    Query: {
        allBoards: async (_0, _1, { prisma }) =>
            await prisma.board.findMany(),
        board: async (_0, { id }, { prisma }) =>
            await prisma.board.findFirstOrThrow({
                where: { id },
                include: {
                    statuses: {
                        include: { tasks: true },
                        orderBy: { ordering: 'asc' }
                    }
                }
            })
    },
    Mutation: {
        createBoard: async (_0, { input }, { prisma }) => {
            const { name, statuses } = input;
            const dataForNewStatuses = statuses.map((status, index) => ({ title: status, ordering: index }));

            return prisma.board.create({
                data: {
                    name,
                    statuses: {
                        create: dataForNewStatuses
                    }
                },
                include: { statuses: true }
            });
        },
        deleteBoard: async (_0, { id }, { prisma }) =>
            await prisma.board.delete({ where: { id } }),
        updateStatus: async (_0, { id, newValues }, { prisma }) => {
            const data = { ...newValues } as any;

            return await prisma.status.update({
                where: { id },
                data,
            });
        },
        createTask: async (_0, { boardId, newTask }, { prisma }) => {
            const board = await prisma.board.findFirstOrThrow({
                where: { id: boardId },
                include: {
                    statuses: {
                        include: { tasks: true }
                    }
                }
            });
            const [firstStatus] = board.statuses.sort(({ ordering: a }, { ordering: b }) => a > b ? 1 : -1);
            checkIfTaskCanBeAddedTo(firstStatus);

            return await prisma.task.create({
                data: {
                    text: newTask.text,
                    statusId: firstStatus.id
                }
            });
        },
        moveTask: async (_0, { taskId, newStatusId }, { prisma }) => {
            const status = await prisma.status.findFirstOrThrow({
                where: { id: newStatusId },
                include: { tasks: true }
            });
            checkIfTaskCanBeAddedTo(status);

            return await prisma.task.update({
                where: { id: taskId, },
                data: { statusId: newStatusId },
            });
        },
        deleteTask: async (_0, { taskId }, { prisma }) => {
            return await prisma.task.delete({
                where: { id: taskId },
            });
        },
    },
    Board: {
        id: (parent) => parent.id
    }
};
