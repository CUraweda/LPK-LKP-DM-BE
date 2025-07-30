import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest, Forbidden, NotFound } from "../../exceptions/catch.execption.js";
import { hash } from "../../helpers/bcrypt.helper.js";

class userService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    if (query.only_admin == '1') q.where['role'] = { code: "ADMIN" }
    if (query.member_name) q.where['member'] = { name: { contains: query.member_name } }
    const data = await this.db.user.findMany({ ...q, include: {Facilitator: true ,member: { select: { name: true, phoneNumber: true, profileImage: true } }} });

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  count = async (query) => {
    const q = this.transformBrowseQuery(query);
    if (query.only_admin == '1') q.where['role'] = { code: "ADMIN" }
    const data = await this.db.user.count({
      ...q,
    });
    return data;
  };

  findById = async (id) => {
    const data = await this.db.user.findUnique({ where: { id } });
    return data;
  };

  getAllAdminIds = async () => {
    const data = (await this.db.user.findMany({ where: { role: { code: "ADMIN" } }, select: { id: true } })).map((user) => user.id)
    return data;
  };

  create = async (payload) => {
    const emailExist = await this.db.user.findFirst({ where: { email: payload.email } })
    if(emailExist) throw new BadRequest("Email telah diigunakan")
    return await this.db.user.create({ data: payload });
  };

  createAdmin = async (payload) => {
    if(!payload.roleId){
      const roleAdmin = await this.db.role.findFirst({ where: { code: "ADMIN" } })
      payload['roleId'] = roleAdmin.id
    }

    const { name, phoneNumber, profileImage, ...rest } = payload
    const emailExist = await prisma.user.findUnique({ where: { email: rest['email'] } });
    if (emailExist) throw new Forbidden('Email telah digunakan');
    const phoneExist = await prisma.member.findUnique({ where: { phoneNumber } });
    if (phoneExist) throw new Forbidden('Nomor Telepon telah digunakan');

    rest['password'] = await hash(rest['password'])
    delete rest['confirm_password']
    const data = await this.db.user.create({ data: rest });
    const memberData = await this.db.member.update({ where: { id: data.memberId }, data: { name, phoneNumber, profileImage } })
    data['member'] = memberData
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.user.update({ where: { id }, data: payload });
    return data;
  };

  updateAdmin = async (id, payload) => {
    const { name, phoneNumber, profileImage, ...rest } = payload
    const userData = await prisma.user.findFirst({ where: { id }, include: { member: true } })
    if(!userData) throw new NotFound("Akun tidak ditemukan")

    if (rest['email'] && (userData.email != rest['email'])) {
      const existing = await prisma.user.findUnique({ where: { email: rest['email'] } });
      if (existing) throw new Forbidden('Email telah digunakan');
    }

    if (rest['phoneNumber'] && (userData.member.phoneNumber != rest['phoneNumber'])) {
      const existing = await prisma.member.findUnique({ where: { phoneNumber: rest['phoneNumber'] } });
      if (existing) throw new Forbidden('Nomor telepon telah digunakan');
    }

    if (rest['password']){
      rest['password'] = await hash(rest['password'])
      delete rest['confirm_password']
    } 
    const data = await this.db.user.update({ where: { id }, data: { ...rest } });
    const memberData = await this.db.member.update({
      where: { id: data.memberId }, data: {
        ...(name && { name }),
        ...(phoneNumber && { phoneNumber }),
        ...(profileImage && { profileImage })
      }
    })
    data['member'] = memberData
    return data;
  };

  delete = async (id) => {
    const data = await this.db.user.delete({ where: { id } });
    return data;
  };
}

export default userService;  
