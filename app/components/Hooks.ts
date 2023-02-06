import { useMutation, useQuery } from "@apollo/client";
import { gql } from "./__gql__";
import { Task } from "./__gql__/graphql";

const QUERY_BOARD = gql(/* GraphQL */`
  query specificBoard($id: Int!) {
    board(id: $id) {
      id
      name
      statuses {
        id
        boardId
        ordering
        title
        limit
        tasks {
          id
          statusId
          text
        }
      }
    }
  }
`);

export const useQueryBoard = (id: number) => {
  const { loading, error, data } = useQuery(QUERY_BOARD, { variables: { id: Number(id) } });
  const statuses = data?.board?.statuses ?? [];

  return {
    name: data?.board?.name ?? '',
    statuses,
  };
};

const ADD_TASK = gql(/* GraphQL */`
  mutation createTask($id: Int!, $taskText: String!) {
    createTask(boardId: $id, newTask: { text: $taskText }) {
      id
      statusId
      text
    }
  }
`);

export const useAddTask = () => useMutation(ADD_TASK, {
  update: (cache, { data }) => {
    const newTask = data?.createTask;
    if (!newTask) {
      return;
    }
    const { statusId } = newTask;

    cache.modify({
      id: cache.identify({ __typename: "Status", id: statusId }),
      fields: {
        tasks: (tasks: Task[] = []) => [...tasks, newTask],
      }
    });
  }
});

const MOVE_TASK = gql(/* GraphQL */`
  mutation moveTask($taskId: Int!, $statusId: Int!) {
    moveTask(taskId: $taskId, newStatusId: $statusId) {
      id
      statusId
    }
  }
`);

export const useMoveTask = () => useMutation(MOVE_TASK, {
  update: (cache, { data }) => {
    const movedTask = data?.moveTask;
    if (!movedTask) {
      return;
    }
    const { statusId } = movedTask;

    cache.modify({
      id: cache.identify({ __typename: 'Status', id: statusId }),
      fields: {
        tasks: (tasks: Task[] = []) => [...tasks, movedTask],
      }
    });
  }
});

const DELETE_TASK = gql(/* GraphQL */`
  mutation deleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId) {
      id
    }
  }
`);

export const useDeleteTask = (task: Task) => useMutation(DELETE_TASK, {
  variables: { taskId: task.id },
  update: (cache, { data }) => {
    const id = data?.deleteTask?.id;
    if (!id) {
      return;
    }

    const cacheId = cache.identify({ id, __typename: 'Task' });
    cache.evict({ id: cacheId });
    cache.gc();
  },
});