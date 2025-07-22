import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";

class memberworkService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberWork.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberWork.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberWork.findUnique({ where: { id: convertId } });
    return data;
  };

  findByUser = async (id) => {
    const userId = Number(id)
    const data = await this.db.memberWork.findMany({ where: { memberId: userId } });
    return data;
  };

  create = async (payload) => {
    const member = await this.db.member.findFirst({where: { id: payload.memberId }})
    if(!member) throw new BadRequest("Data member tidak ditemukan")
    if(member.isGraduate != true){
      throw new Error("Anda tidak bisa menambahkan pekerjaan jika belum lulus!")
    }
    const data = await this.db.memberWork.create({ data: payload });
    return data;
  };


  update = async (id, payload) => {
    const convertId = Number(id)
    const data = await this.db.memberWork.update({ where: { id: convertId }, data: payload });
    return data;
  };

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberWork.delete({ where: { id: convertId } });
    return data;
  };
}

export default memberworkService;  
