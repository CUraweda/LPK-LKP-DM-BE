import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";
import paymentService from "../payment/payment.service.js";

class memberloanService extends BaseService {
  constructor() {
    super(prisma);
    this.paymentService = new paymentService()
  }
  formatUID = (memberId, index) => {
    const [year, month, day] = new Date().toISOString().split("T")[0].split("-")
    return `${memberId}${day}${month}${year}${index}`
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberLoan.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberLoan.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.memberLoan.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.memberLoan.create({ data: payload });
    return data;
  };

  generateLoan = async (payload) => {
    const { memberId, createTransaction } = payload
    let data = payload.listOfTotal.map((total, index) => ({
      ...payload,
      total,
      loanUID: this.formatUID(memberId, index + 1)
    }));
    const datas = await this.db.memberLoan.createMany({ data });
    if (createTransaction) await this.generateTransaction(datas[0].id, { paymentMethod: payload['paymentMethod'] })
    return datas
  };

  generateTransaction = async (id, payload) => {
    const data = await this.db.memberLoan.findFirst({ where: { id } })
    if (!data) throw new BadRequest("Cicilan tidak ditemukan")
    payload['memberId'] = payload['memberId'] ? payload['memberId'] : payload['user'].member.id
    const createdPayment = await this.paymentService.createPayment({ ...payload, paymentTotal: data.total, purpose: "Pendaftaran", status: "Tunda" })
    const { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate, merchantTradeNo, transactionId, ...rest } = createdPayment
    await this.db.memberLoan.update({ where: { id }, data: { transactionId } })
    return { merchantTradeNo, paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate, transactionId }

  }

  update = async (id, payload) => {
    const data = await this.db.memberLoan.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.memberLoan.delete({ where: { id } });
    return data;
  };
}

export default memberloanService;  
