import { schema as odooSchema }   from './schema';
import queries       from './queries';
import mutations     from './mutations';

export {
    odooSchema,
    queries   as odooResolvers,
    mutations as odooMutations,
};
