import BaseService from '../../base/service.base.js';
import { prism } from '../../config/prisma.db.js';
import { BadRequest, ServerError } from '../../exceptions/catch.execption.js';
import { PaymentHelper } from '../../helpers/payment/payment.helper.js';
import { sendOn } from '../../socket/index.js';
import notificationService from '../notification/notification.service.js';

class paymentService extends BaseService {
    notificationService;
    constructor() {
        super(prism);
        this.paymentHelper = new PaymentHelper();
        this.notificationService = new notificationService();
    }

    generateTID = (payload) => {
        const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const differ = payload.purpose != 'Pendaftaran' ? 'INS' : 'REG';
        return `${differ}-${result}`;
    };

    findAll = async (query) => {
        const q = this.transformBrowseQuery(query);
        const data = await this.db.Transaction.findMany({
        ...q,
        include: {
            SavingsData: true,
            member: { select: { id: true, userId: true, fullName: true } },
        },
        });

        if (query.paginate) {
        const countData = await this.db.Transaction.count({ where: q.where });
        return this.paginate(data, countData, q);
        }
        return data;
    };

    findById = async (id) => {
        const data = await this.db.Transaction.findUnique({ where: { id } });
        return data;
    };

    findRecapStatus = async (id) => {
        const data = await this.db.Transaction.groupBy({
        by: ['status'],
        _count: { _all: true },
        _sum: {
            paymentTotal: true,
        },
        });

        return data.map((item) => ({
        status: item.status,
        total: item._count._all,
        totalSum: item._sum.paymentTotal,
        }));
    };

    notifyPayment = async (id, args = {}) => {
        const { status } = args;
        id = this.paymentHelper._decryptTID(id);
        const data = await this.db.Transaction.findFirst({
        where: { id, isPaid: false },
        include: { member: { include: { user: true } } },
        });
        if (!data) throw new BadRequest('Transaction didnt exist');
        const updateMember = data.purpose === 'Pendaftaran';
        const updateSaving = data.purpose.includes('Simpanan');

        if (updateMember && updateSaving)
        throw new BadRequest('Payment cannot be procced because unknown purpose');

        let updateData = {};
        switch (status) {
        case 'SUCCESS':
            updateData['Transaction'] = {
            isPaid: true,
            paymentDate: new Date(),
            status: 'Selesai',
            };
            if (updateMember)
            updateData['memberData'] = { registrationIsPaid: true };
            if (updateSaving)
            updateData['savingData'] = {
                status: 'Lunas',
                isPaymentSuccess: true,
            };

            break;
        case 'FAILED':
            updateData['Transaction'] = { isPaid: false, status: 'Gagal' };
            break;
        default:
            updateData['Transaction'] = { isPaid: false, status: 'Gagal' };
            break;
        }
        const notifPayload = {
        title: `Pembayaran ${data.purpose}`,
        label: 'Payment',
        message: `Pembayaran ${data.purpose} Total ${data.paymentTotal} ${status}`,
        fromAdmin: false,
        subTopic: 'payment',
        userIds: [data.member.userId],
        };
        await this.notificationService.create(notifPayload);

        const updatedData = await this.db.Transaction.update({
        where: { id },
        data: updateData.Transaction,
        });
        if (!updatedData) throw new BadRequest('Error occured while updating');
        if (updateData.memberData)
        await this.db.memberData.update({
            where: { registrationPaymentId: data.id },
            data: updateData.memberData,
        });
        if (updateData.savingData)
        await this.db.savingsData.update({
            where: { paymentId: data.id },
            data: updateData.savingData,
        });

        const userId = data.member.user.id;
        if (userId) sendOn('payment_notif', [userId]);

        return updatedData;
    };

    create = async (payload) => {
        payload['transactionId'] = this.generateTID(payload);
        const data = await this.db.Transaction.create({ data: payload });
        return data;
    };

    createPayment = async (payload) => {
        const { transactionId, paymentType } = payload;
        const data = await this.db.Transaction.findFirst({
        where: { id: transactionId, isPaid: false },
        include: { member: { include: { user: true } } },
        });
        if (!data) throw new BadRequest('Transaction didnt exist');

        const paymentData = await this.paymentHelper.create({ ...payload, data });
        return await this.db.Transaction.update({
        where: { id: data.id },
        data: {
            paymentMethod: paymentType,
            merchantTradeNo: paymentData?.merchantTradeNo,
            platformTradeNo: paymentData?.platformTradeNo,
            qrisLink: paymentData?.qrisUrl,
            customerNo: paymentData?.virtualAccountData?.customerNo,
            virtualAccountNo: paymentData?.vaCode,
            expiredDate: paymentData.expiredDate,
        },
        });
    };

    update = async (id, payload) => {
        const data = await this.db.Transaction.update({
        where: { id },
        data: payload,
        });
        return data;
    };

    delete = async (id) => {
        const data = await this.db.Transaction.delete({ where: { id } });
        return data;
    };
}

export default paymentService;
