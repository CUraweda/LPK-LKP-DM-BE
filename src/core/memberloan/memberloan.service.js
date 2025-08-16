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
    const [hour, minute] = new Date().toISOString().split("T")[1].split(":")
    return `${memberId}${day}${month}${year}$${hour}${minute}${index}`
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberLoan.findMany({ ...q, include: { member: { select: { name: true } }, transaction: { select: { status: true, paymentDate: true, isPaid: true, paymentTotal: true, paymentMethod: true } } } });

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
    payload['loanUID'] = this.formatUID(payload['memberId'], 0) //0 = Pertama
    const data = await this.db.memberLoan.create({ data: payload });
    return data;
  };

  generateLoan = async (payload) => {
    const { memberId, createTransaction, context, } = payload
    let data = payload.listOfTotal.map((total, index) => ({
      memberId, context,
      total,
      loanUID: this.formatUID(memberId, index + 1)
    }));
    if (createTransaction) {
      const first = await this.db.memberLoan.create({ data: data[0] })
      await this.generateTransaction(first.id, { paymentMethod: payload['paymentMethod'], memberId, updateRegistPayment: true })
      data.splice(1, 1)
    }
    await this.db.memberLoan.createMany({ data });
    return
  };

  generateTransaction = async (id, payload = { paymentMethod: "", memberId: 0, updateRegistPayment: false }) => {
    const { updateRegistPayment, ...other } = payload
    const data = await this.db.memberLoan.findFirst({ where: { id } })
    if (!data) throw new BadRequest("Cicilan tidak ditemukan")
    const createdPayment = await this.paymentService.createPayment({
      ...other,
      ...(payload['updateRegistPayment'] && { registrasi: true }),
      paymentTotal: data.total, purpose: "Pendaftaran", status: "Tunda"
    })
    const { paymentMethod, paymentTotal, qrisLink, virtualAccountNo, expiredDate, merchantTradeNo, transactionId, ...rest } = createdPayment
    await this.db.$transaction(async (prism) => {
      const exist = await prism.memberLoan.count({ where: { transactionId: createdPayment['id'] } })
      if(exist > 0) return
      await this.db.memberLoan.update({ where: { id }, data: { transactionId: createdPayment['id'] } })
    })
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
