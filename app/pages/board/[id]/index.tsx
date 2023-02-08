import { EditStatusModal } from "@/components/EditStatusModal";
import { isStatusLimitReached } from "@/components/helper";
import { Status } from "@/components/__gql__/graphql";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAddTask, useQueryBoard } from "../../../components/Hooks";
import StatusColumn from "../../../components/StatusColumn";

const Home = () => {
  const router = useRouter();
  const { id: idAsString } = router.query;
  const id = Number(idAsString);
  const { name, statuses } = useQueryBoard(id);

  const [taskText, setTaskText] = useState('');
  const [addTask] = useAddTask();

  const [firstStatus] = statuses;
  const cannotAddTasks: boolean = !firstStatus || isStatusLimitReached(firstStatus);

  const [selectedStatus, setSelectedStatus] = useState<Status|undefined>(undefined);

  return (
    <div>
      <h3>{name}</h3>
      <div>
        <h5>Create a new task:</h5>
        <label htmlFor="taskText">Description:</label>
        <input name="taskText" value={taskText} onChange={e => setTaskText(e.target.value)} />
        <button
          onClick={() => addTask({ variables: { id, taskText } })}
          disabled={cannotAddTasks}
        >
          Add
        </button>
      </div>
      <div style={{ backgroundColor: "#EEEEEE", display: "flex" }}>
        {
          statuses.flatMap(s => s ? [s] : []).map(status => {
            return (
              <StatusColumn key={status.id} status={status} selectStatus={setSelectedStatus} />
            )
          })
        }
      </div>
      <EditStatusModal open={!!selectedStatus} status={selectedStatus} onClose={() => setSelectedStatus(undefined)}/>
    </div>
  );
}

export default Home;