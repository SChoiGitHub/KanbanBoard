import { CreateFormModal } from "@/components/CreateFormModal";
import { gql } from "@/components/__gql__";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const GET_BOARDS = gql(/* GraphQL */`
  query allBoards {
    allBoards {
      id
      name
    }
  }
`);

const DELETE_BOARD = gql(/* GraphQL */`
  mutation deleteBoard($id: Int!) {
    deleteBoard(id: $id) {
      id
    }
  }
`);

const List = () => {
  const { loading, error, data } = useQuery(GET_BOARDS);
  const [deleteBoard] = useMutation(DELETE_BOARD, {
    update: (cache, { data }) => {
      const deleteBoard = data?.deleteBoard;
      if (!deleteBoard) {
        return;
      }

      const cacheId = cache.identify(deleteBoard);
      cache.evict({ id: cacheId });
      cache.gc();
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>We could not load the data.</p>
  }

  if (!data?.allBoards) {
    return null;
  } else if (data.allBoards.length === 0) {
    return <p>No boards were found.</p>
  }

  return (
    <ul>
      {data.allBoards.map(({ id, name }) => {
        return (
          <li key={id}>
            <Link href={`board/${id}`}>{name}</Link>
            <ul>
              <li>
                <Button onClick={() => deleteBoard({ variables: { id } })}>Delete</Button>
              </li>
            </ul>
          </li>
        )
      })}
    </ul>
  );
}

const Home = () => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpenCreate(true)}>Create a New Board</Button>
      <h6>View an Existing Board</h6>
      <CreateFormModal open={openCreate} onClose={() => setOpenCreate(false)} />
      <List />
    </div>
  );
}

export default Home;