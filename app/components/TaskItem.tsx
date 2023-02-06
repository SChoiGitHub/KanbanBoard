import { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import { useDeleteTask } from './Hooks';
import { Task } from './__gql__/graphql';

export const TaskFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ margin: "8px", backgroundColor: "#DDDDDD", display: "flex" }}>
      {children}
    </div>
  );
}

export const TaskItem = ({ task }: { task: Task }) => {
  const [_0, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { task },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  const [deleteTask] = useDeleteTask(task);

  return (
    <div ref={drag}>
      <TaskFrame>
        <p onClick={() => deleteTask()}>Delete</p>
        <br/>
        <div>
        {task.text}
        </div>
      </TaskFrame>
    </div>
  );
}