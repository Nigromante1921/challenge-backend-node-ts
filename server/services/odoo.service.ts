import * as xmlrpc from 'xmlrpc';
import { logger } from '../config/logger';
import config       from '../config/app';

const { url, db, uid: uidStr, password } = config.odoo;
const uid = Number(uidStr);

const commonClient = xmlrpc.createClient({ url: `${url}/xmlrpc/2/common` });
const objectClient = xmlrpc.createClient({ url: `${url}/xmlrpc/2/object` });

export class OdooService {
    async authenticate(): Promise<number> {
        logger.info({ db, uid }, 'OdooService.authenticate');
        return new Promise((res, rej) => {
            commonClient.methodCall('authenticate', [db, uid, password, {}], (err, resUid) =>
                err ? rej(err) : (logger.info({ resUid }, 'Authenticated'), res(resUid as number))
            );
        });
    }

    async findPartners(field: 'email'|'name', value: string): Promise<any[]> {
        const domain = [[field, '=', value]];
        logger.info({ domain }, 'OdooService.findPartners');
        return new Promise((res, rej) => {
            objectClient.methodCall(
                'execute_kw',
                [db, uid, password, 'res.partner', 'search_read', [domain], { fields: ['id','name','email'] }],
                (err, partners) => err ? rej(err) : (logger.info({ count: (partners as any[]).length }, 'Found partners'), res(partners as any[]))
            );
        });
    }

    async createPartner(data: { name: string; email?: string }): Promise<number> {
        logger.info({ data }, 'OdooService.createPartner');
        return new Promise((res, rej) => {
            objectClient.methodCall(
                'execute_kw',
                [db, uid, password, 'res.partner', 'create', [data]],
                (err, id) => err ? rej(err) : (logger.info({ id }, 'Partner created'), res(id as number))
            );
        });
    }

    async updatePartner(partnerId: number, changes: Partial<{ name: string; email: string }>): Promise<boolean> {
        logger.info({ partnerId, changes }, 'OdooService.updatePartner');
        return new Promise((res, rej) => {
            objectClient.methodCall(
                'execute_kw',
                [db, uid, password, 'res.partner', 'write', [[partnerId], changes]],
                (err, ok) => err ? rej(err) : (logger.info({ ok }, 'Partner updated'), res(ok as boolean))
            );
        });
    }
}
