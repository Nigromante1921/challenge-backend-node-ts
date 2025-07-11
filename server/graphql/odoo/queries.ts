import { IResolvers } from '@graphql-tools/utils';
import { OdooService }    from '../../services/odoo.service';

const svc = new OdooService();

const OdooQueries: IResolvers = {
    Query: {
        findPartnerByEmail: async (_p, { email }, { logger }) => {
            logger.info({ email }, 'Resolver.findPartnerByEmail');
            return svc.findPartners('email', email);
        },
        findPartnerByName: async (_p, { name }, { logger }) => {
            logger.info({ name }, 'Resolver.findPartnerByName');
            return svc.findPartners('name', name);
        },
    }
};

export default OdooQueries;
