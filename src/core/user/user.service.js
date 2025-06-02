import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { Forbidden } from "../../exceptions/catch.execption.js";
import { hash } from "../../helpers/bcrypt.helper.js";

class userService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.user.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.user.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.user.create({ data: payload });
    return data;
  };

  createAdmin = async (payload) => {
    const roleAdmin = await this.db.role.findFirst({ where: { code: "ADMIN" } })
    payload['roleId'] = roleAdmin.id

    const { name, phoneNumber, ...rest } = payload
    const existing = await prisma.user.findUnique({ where: { email: rest['email'] } });
    if (existing) throw new Forbidden('Akun dengan email telah digunakan');

    console.log(rest)
    rest['password'] = await hash(rest['password'])
    const data = await this.db.user.create({ data: rest });

    await this.db.member.update({ where: { id: data.memberId }, data: { name } })
    data.member.name = name
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.user.update({ where: { id }, data: payload });
    return data;
  };

  updateAdmin = async (id, payload) => {
    const { name, ...rest } = payload
    const data = await this.db.user.update({ where: { id }, data: rest });
    await this.db.member.update({ where: { id: data.id }, data: { name } })
    return data;
  };

  delete = async (id) => {
    const data = await this.db.user.delete({ where: { id } });
    return data;
  };
}

export default userService;  
