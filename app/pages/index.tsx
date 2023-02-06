import { gql } from "@/components/__gql__";
import { useQuery } from "@apollo/client";
import Link from "next/link";

const QUERY = gql(/* GraphQL */`
  query allBoards {
    allBoards {
      id
      name
    }
  }
`);

const List = () => {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>We could not load the data.</p>
  }

  if (!data?.allBoards) {
    return null;
  }

  return (
    <ul>
      {data.allBoards.map(({ id, name }) => {
        return (
          <li key={id}>
            <Link href={`board/${id}`}>{name}</Link>
          </li>
        )
      })}
    </ul>
  );
}

const Home = () => {
  return (
    <div>
      <Link href="/board/create">Create a new Board</Link>
      <h6>View an Existing Board</h6>
      <List />
    </div>
  );
}

export default Home;