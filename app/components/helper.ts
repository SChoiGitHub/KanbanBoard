import { Status } from './__gql__/graphql';


export const isStatusLimitReached = ({ limit, tasks }: Status) => !!(limit && limit > 0 && limit <= (tasks?.length ?? 0));