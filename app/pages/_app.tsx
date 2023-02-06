import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { AppProps } from 'next/app'
import Link from 'next/link';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Board: {
        keyFields: ["id"],
        fields: {
          statuses: {
            merge: (current = [], incoming = []) => [...current, ...incoming],
          }
        }
      },
      Status: {
        keyFields: ["id"],
        fields: {
          tasks: {
            merge: (current = [], incoming = []) => [...current, ...incoming],
          }
        }
      },
      Task: {
        keyFields: ["id"],
      },
    }
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ApolloProvider client={client}>
        <Link href="/"><h1>Kanban</h1></Link>
        <Component {...pageProps} />
      </ApolloProvider>
    </DndProvider>
  );
}
