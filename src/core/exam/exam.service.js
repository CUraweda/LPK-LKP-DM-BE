import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';

const allFields = ['id', 'trainingId', 'title', 'description', 'totalQuestions', 'totalHours', 'questions', 'date'];
const excludedFields = ['answers'];

const selectExamSiswa = Object.fromEntries(
  allFields
    .filter((field) => !excludedFields.includes(field))
    .map((field) => [field, true])
);

class examService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const { revealAnswers } = query
    const q = this.transformBrowseQuery(query);
    
    const where = {
      ...q.where,
      ...(query.memberId && {
        memberTests: {
          some: {
            memberId: Number(query.memberId),
          },
        },
      }),
    };
    
    const data = await this.db.exam.findMany({
      ...q,
      where,
      select: {
        ...selectExamSiswa,
        ...((revealAnswers && revealAnswers == "1") && { answers: true }),
        memberTests: query.memberId
        ? {
          where: {
              memberId: Number(query.memberId),
            },
          }
          : true,
      }
    });

    if (query.paginate) {
      const countData = await this.db.exam.count({ where });
      return this.paginate(data, countData, q);
    }

    return data;
  };


  findById = async (id) => {
    const { revealAnswers } = query
    const convertId = Number(id);
    const data = await this.db.exam.findUnique({
      where: {
        id: convertId,
        select: {
          ...((!revealAnswers || revealAnswers == "0") && selectExamSiswa),
          memberTests: query.memberId
            ? {
              where: {
                memberId: Number(query.memberId),
              },
            }
            : true,
        }

      }
    });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.exam.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id);
    const data = await this.db.exam.update({ where: { id: convertId }, data: payload });
    return data;
  };

  delete = async (id) => {
    const convertId = Number(id);
    const data = await this.db.exam.delete({ where: { id: convertId } });
    return data;
  };
}

export default examService;  
