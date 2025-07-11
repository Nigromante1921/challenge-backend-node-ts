import { IResolvers } from '@graphql-tools/utils';
import { OdooService }    from '../../services/odoo.service';

const svc = new OdooService();

const OdooMutations: IResolvers = {
    Mutation: {
        createPartner: async (_p, { input }, { logger }) => {
            logger.info({ input }, 'Resolver.createPartner');
            return svc.createPartner(input);
        },
        updatePartner: async (_p, { id, input }, { logger }) => {
            const pid = Number(id);
            logger.info({ partnerId: pid, changes: input }, 'Resolver.updatePartner');
            return svc.updatePartner(pid, input);
        },
    }
};

export default OdooMutations;
