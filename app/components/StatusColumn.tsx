import Link from 'next/link';
import { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { isStatusLimitReached } from './helper';
import { useMoveTask } from './Hooks';
import { TaskItem, TaskFrame } from './TaskItem';
import { Status, Task } from './__gql__/graphql';

type Props = {
  status: Status;
};

const StatusColumn = ({ status }: Props) => {
  const { title, id, boardId } = status;
  const tasks = status.tasks ?? [];
  const isLimitReached = isStatusLimitReached(status);
  const [moveTask] = useMoveTask();

  const [_0, drop] = useDrop(
    () => ({
      accept: 'ITEM',
      drop: ({ task }: { task: Task }) => {
        if (task.statusId !== id) {
          moveTask({ variables: { taskId: task.id, statusId: id } });
        }
      },
    }),
  )

  return (
    <div style={{ flex: "1 1 0", width: "0" }} ref={isLimitReached ? null : drop}>
      <h4><Link href={`/board/${boardId}/${id}`}>{title}</Link></h4>
      {isLimitReached && (<h5>You reached the WIP Limit. Finish these tasks.</h5>)}
      {tasks.length > 0 ? tasks.map(task => {
        if (!task) {
          return;
        }

        return (<TaskItem key={task.id} task={task} />);
      }) : (
        <TaskFrame>
          No tasks in this status
        </TaskFrame>
      )}
    </div>
  );
}

export default StatusColumn;