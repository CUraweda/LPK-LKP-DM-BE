import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import { BadRequest } from "../../exceptions/catch.execption.js";
import AuthenticationService from "../authentication/authentication.service.js";

class facilitatorService extends BaseService {
  constructor() {
    super(prisma);
    this.authenticationService = new AuthenticationService()
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.facilitator.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.facilitator.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const data = await this.db.facilitator.findUnique({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.facilitator.create({ data: payload });
    return data;
  };

  generateOne = async (payload) => {
    const { name, position, phoneNumber } = payload
    const user = await this.authenticationService.register(payload)
    return await this.db.facilitator.create({ data: { userId: user.user.id, phoneNumber, position, name } });
  };

  update = async (id, payload) => {
    const data = await this.db.facilitator.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.facilitator.delete({ where: { id } });
    return data;
  };
}

export default facilitatorService;  
