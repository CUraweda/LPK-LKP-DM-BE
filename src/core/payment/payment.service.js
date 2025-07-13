import BaseService from '../../base/service.base.js';
import prism from '../../config/prisma.db.js';
import { BadRequest, ServerError } from '../../exceptions/catch.execption.js';
import { PaymentHelper } from '../../helpers/payment/payment.helper.js';
import { sendOn } from '../../socket/index.js';
import chatService from '../chat/chat.service.js';

class paymentService extends BaseService {
    constructor() {
        super(prism);
        this.paymentHelper = new PaymentHelper();
        this.chatService = new chatService()
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

    findMe = async (user) => {
        const data = await this.db.transaction.findMany({
            where: { memberId: user.member.id }
        })
        return data
    }
    // findAll = async (query) => {
    //     const q = this.transformBrowseQuery(query);
    //     const data = await this.db.transaction.findMany({
    //     ...q,
    //     include: {
    //         member: { select: { id: true, name: true } },
    //     },
    //     });

    //     if (query.paginate)au {
    //     const countData = await this.db.memberTransaction.count({ where: q.where });
    //     return this.paginate(data, countData, q);
    //     }
    //     return data;
    // };

    // findById = async (id) => {
    //     const data = await this.db.Transaction.findUnique({ where: { id } });
    //     return data;
    // };

    notifyPayment = async (id, args = {}) => {
        const { status } = args;
        id = this.paymentHelper._decryptTID(id);
        const data = await this.db.transaction.findFirst({
            where: { transactionId: id, isPaid: false },
            include: { member: { include: { User: true } } },
        });
        if (!data) throw new BadRequest('Transaksi tidak ditemukan');
        const updateMember = data.purpose === 'Pendaftaran';
        let updateData = {};
        switch (status) {
            case 'SUCCESS':
                updateData['Transaction'] = {
                    isPaid: true,
                    paymentDate: new Date(),
                    status: 'Selesai',
                };
                updateData['memberTransaction'] = {
                    isSuccess: true,
                    paymentDate: new Date()
                };
                if (updateMember) updateData['memberData'] = { dataVerified: true, verifiedAt: new Date(), memberState: "SEL" };
                break;
            case 'FAILED':
                updateData['Transaction'] = { isPaid: false, status: 'Gagal' };
                break;
            default:
                updateData['Transaction'] = { isPaid: false, status: 'Gagal' };
                break;
        }
        const messagePayload = {
            message: `Pembayaran ${data.purpose} Total ${data.paymentTotal} ${status}`,
            type: "T"
        };
        await this.chatService.sendToAdmin(messagePayload);

        const memberTrx = await this.db.memberTransaction.findFirst({ where: { transactionId: data.id } });
        if (!memberTrx) throw new Error("MemberTransaction not found!")

        if (updateData.memberData) await this.db.member.update({ where: { id: data.memberId }, data: updateData.memberData, });
        if (memberTrx) await this.db.memberTransaction.update({ where: { id: memberTrx.id }, data: updateData.memberTransaction, });
        const updatedData = await this.db.transaction.update({ where: { id: data.id }, data: updateData.Transaction, });
        if (!updatedData) throw new BadRequest('Error occured while updating');

        const userId = data.member.User.id;
        if (userId) sendOn('payment_notif', [userId]);

        return updatedData;
    };

    createPayment = async (payload) => {
        try {
            const { memberId, user, ...rest } = payload;
            rest['transactionId'] = this.generateTID(payload);
            const memberData = await this.db.member.findFirst({ where: { id: memberId }, select: { registrationPaymentId: true } })
            let transactionTable
            if (!memberData.registrationPaymentId) {
                transactionTable = await this.db.transaction.create({ data: { ...rest, memberId: memberId } });
                await this.db.memberTransaction.create({
                    data: {
                        memberId: memberId,
                        paymentTotal: payload.paymentTotal,
                        transactionId: transactionTable.id,
                        paymentDate: new Date()
                    }
                });
                await this.db.member.update({ where: { id: memberId }, data: { registrationPaymentId: transactionTable.id } })
            } else transactionTable = await this.db.transaction.findFirst({ where: { id: memberData.registrationPaymentId } })

            payload['username'] = user.member.name
            payload['email'] = user.email
            const paymentData = await this.paymentHelper.create({ ...payload, transaction: transactionTable });
            return await this.db.transaction.update({
                where: { id: transactionTable.id },
                data: {
                    paymentMethod: payload['paymentMethod'],
                    merchantTradeNo: paymentData?.merchantTradeNo,
                    platformTradeNo: paymentData?.platformTradeNo,
                    qrisLink: paymentData?.qrisUrl,
                    customerNo: paymentData?.virtualAccountData?.customerNo,
                    virtualAccountNo: paymentData?.vaCode,
                    expiredDate: paymentData.expiredDate,
                },
            });
        } catch (error) {
            console.error("Error in createPayment:", error);
            throw error;
        }
    };
}

export default paymentService;
