import { resolvers } from '@/api/Resolvers';
import { readFileSync } from 'fs';
import { createSchema, createYoga } from 'graphql-yoga'
import { buildContext, ContextType } from '../../api/Context'

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const schema = createSchema<ContextType>({
  typeDefs,
  resolvers,
});

const yoga = createYoga<ContextType>({
  schema,
  context: buildContext,
  graphqlEndpoint: '/api/graphql'
});

export default yoga;