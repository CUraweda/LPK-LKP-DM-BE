import BaseService from '../../base/service.base.js';
import prism from '../../config/prisma.db.js';
import { BadRequest, ServerError } from '../../exceptions/catch.execption.js';
import { PaymentHelper } from '../../helpers/payment/payment.helper.js';
import { sendOn } from '../../socket/index.js';
import chatService from '../chat/chat.service.js';
import { startOfDay, endOfDay, addHours, subDays, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

const wibToUtc = (d) => new Date(d.getTime() - WIB_OFFSET_MS);

const sumOrZero = (agg) => Number(agg?._sum?.paymentTotal || 0);
const makeWibDate = (dateStr, isEnd) => {
  const suffix = isEnd ? 'T23:59:59.999+07:00' : 'T00:00:00+07:00';
  return new Date(`${dateStr}${suffix}`);
};

const JKT_OFFSET_HOURS = 7;
const toUtc = (d) => addHours(d, -JKT_OFFSET_HOURS);
const pctChange = (current, previous) =>previous === 0 ? null : +(((current - previous) / previous) * 100).toFixed(2);

class paymentService extends BaseService {
    constructor() {
        super(prism);
        this.paymentHelper = new PaymentHelper();
        this.chatService = new chatService()
    }
    
    getTodayStats = async () => {
        const now = new Date();

        const [todayAgg, yesterdayAgg] = await this.db.$transaction([
            this.db.transaction.aggregate({
            _sum: { paymentTotal: true },
            where: {
                createdAt: {
                gte: toUtc(startOfDay(now)),
                lte: toUtc(endOfDay(now)),
                },
            },
            }),
            this.db.transaction.aggregate({
            _sum: { paymentTotal: true },
            where: {
                createdAt: {
                gte: toUtc(startOfDay(subDays(now, 1))),
                lte: toUtc(endOfDay(subDays(now, 1))),
                },
            },
            }),
        ]);

        const todayTotal = sumOrZero(todayAgg);
        const yesterdayTotal = sumOrZero(yesterdayAgg);

        return {
            totalToday: todayTotal,
            diffTodayPercent:
            yesterdayTotal === 0
                ? null
                : +(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100).toFixed(2),
        };
    };
    
    
    getWeekStats = async () => {
        const now = new Date();

        const [thisWeekAgg, lastWeekAgg] = await this.db.$transaction([
            this.db.transaction.aggregate({
            _sum: { paymentTotal: true },
            where: {
                createdAt: {
                gte: toUtc(startOfWeek(now, { weekStartsOn: 1 })),
                lte: toUtc(endOfWeek(now, { weekStartsOn: 1 })),
                },
            },
            }),
            this.db.transaction.aggregate({
            _sum: { paymentTotal: true },
            where: {
                createdAt: {
                gte: toUtc(startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })),
                lte: toUtc(endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })),
                },
            },
            }),
        ]);

        const thisWeekTotal = sumOrZero(thisWeekAgg);
        const lastWeekTotal = sumOrZero(lastWeekAgg);

        return {
            totalWeek: thisWeekTotal,
            diffWeekPercent:
            lastWeekTotal === 0
                ? null
                : +(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(2),
        };
    };
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
    
    findAll = async (query) => {
        const { startDate, endDate, ...restQuery } = query;
        const q = this.transformBrowseQuery(restQuery);

        if (startDate || endDate) {
            const dateRange = {};
            if (startDate) {
                const localStart = startOfDay(makeWibDate(startDate, false));
                dateRange.gte = wibToUtc(localStart);
            }
            if (endDate) {
                const localEnd = endOfDay(makeWibDate(endDate, true));
                dateRange.lte = wibToUtc(localEnd);
            }
            q.where = {
                ...q.where,
                createdAt: dateRange,
            };
        }

        // ───────────────────── main query ───────────────────────
        const [items, todayStats, weekStats] = await Promise.all([
            this.db.transaction.findMany({
            ...q,
            include: {
                member: { select: { id: true, name: true } },
                memberTransactions: {
                select: {
                    id: true,
                    isSuccess: true,
                    paymentDate: true,
                    training: { select: { id: true, title: true } },
                },
                },
            },
            }),
            this.getTodayStats(),
            this.getWeekStats(),
        ]);

        // ───────────────────── pagination (unchanged) ───────────
        if (restQuery.paginate) {
            const countData = await this.db.transaction.count({ where: q.where });
            const paginated = this.paginate(items, countData, q);
            return { ...todayStats, ...weekStats, ...paginated };
        }

        return { ...todayStats, ...weekStats, items };
    };

    showChart = async (query) => {
        const { startDate, endDate, filterBy } = query;

        const today = new Date();
        let rangeStart = null;

        if (!startDate && !endDate && filterBy === "month") {
            rangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (!startDate && !endDate && filterBy === "year") {
            rangeStart = new Date(today.getFullYear(), 0, 1);
        } else if (!startDate && !endDate && filterBy === "week") {
            rangeStart = new Date(today);
            rangeStart.setDate(today.getDate() - 7);
        }

        const where = {
            ...(startDate && endDate && {
            paymentDate: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            }),
            ...(rangeStart && {
            paymentDate: {
                gte: rangeStart,
                lte: today,
            },
            }),
        };

        const transactions = await this.db.transaction.findMany({
            where,
            select: {
            paymentDate: true,
            paymentTotal: true,
            },
        });

        const grouped = {};

        transactions.forEach(({ paymentDate, paymentTotal }) => {
            const date = paymentDate.toISOString().split("T")[0];

            if (!grouped[date]) {
            grouped[date] = { date, total: 0 };
            }

            grouped[date].total += Number(paymentTotal);
        });

        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    };
    
    findById = async (id) => {
        const data = await this.db.transaction.findUnique({ where: { id } });
        return data;
    };

    notifyPayment = async (id, args = {}) => {
        const { status } = args;
        id = this.paymentHelper._decryptTID(id);
        const data = await this.db.transaction.findFirst({
            where: { transactionId: id },
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
        await this.chatService.sendAdmin(messagePayload);

        const memberTrx = await this.db.memberTransaction.findFirst({ where: { transactionId: data.id } });

        let member, mtransaction;
        if (updateData.memberData) member = await this.db.member.update({ where: { id: data.memberId }, data: updateData.memberData, });
        if (memberTrx) mtransaction = await this.db.memberTransaction.update({ where: { id: memberTrx.id }, data: updateData.memberTransaction, });
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
            const memberData = await this.db.member.findFirst({ where: { id: memberId }, select: { registrationPaymentId: true, name: true, User: { select: { email: true } }  } })
            let transactionTable
            if (!memberData.registrationPaymentId) {
                transactionTable = await this.db.transaction.create({ data: { ...rest, memberId: memberId } });
                await this.db.memberTransaction.create({
                    data: {
                        memberId: memberId,
                        paymentTotal: payload.paymentTotal,
                        transactionId: transactionTable.id,
                        paymentDate: new Date(),
                        trainingId: payload.user.member.trainingId
                    }
                });
                await this.db.member.update({ where: { id: memberId }, data: { registrationPaymentId: transactionTable.id } })
            } else transactionTable = await this.db.transaction.findFirst({ where: { id: memberData.registrationPaymentId } })
            
            payload['username'] = memberData.name || ""
            payload['email'] = memberData.User.email || ""
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
