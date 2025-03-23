import { hash } from 'bcrypt';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import BaseService from '../../base/service.base.js';
import prisma from '../../config/prisma.db.js';
import { Forbidden, NotFound } from '../../exceptions/catch.execption.js';
import { compare } from '../../helpers/bcrypt.helper.js';
import { generateAccessToken, generateRefreshToken } from '../../helpers/jwt.helper.js';

class AuthenticationService extends BaseService {
  constructor() {
    super(prisma);
  }

  login = async (payload) => {
    const user = await this.db.users.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const pwValid = await compare(payload.password, user.password);
    if (!pwValid) throw new BadRequest('Password tidak cocok');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { user: this.exclude(user, ['password', 'apiToken', 'isVerified']), token: { access_token, refresh_token } };
  };

  refreshToken = async (refresh) => {
    const payload = jwt.decode(refresh);

    const user = await this.db.users.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { user: this.exclude(user, ['password', 'apiToken', 'isVerified']), token: { access_token, refresh_token } };
  };

  findUserById = async (id) => {
    const data = await this.db.users.findUnique({
      where: { id }
    });
    return this.exclude(data, ['password']);
  };

  register = async (payload) => {
    const { email, password } = payload;

    return this.db.$transaction(async (prisma) => {
      const findStudent = await prisma.roles.findFirst({
        where: { is_student: true }
      });

      if (!findStudent) throw new NotFound('Tidak ada role siswa')

      const initUser = await prisma.users.create({
        data: {
          role_id: findStudent.id
        }
      });

      const existing = await prisma.users.findUnique({ where: { email } });
      if (existing) throw new Forbidden('Akun dengan email telah digunakan');

      const createdUser = await prisma.users.update({
        where: {
          id: initUser.id
        },
        data: {
          email,
          password: await hash(password, 10),
        },
      });

      await prisma.userMothers.create({
        data: {
          user_id: createdUser.id
        }
      });
      await prisma.userFathers.create({
        data: {
          user_id: createdUser.id
        }
      });
      await prisma.userGuardians.create({
        data: {
          user_id: createdUser.id
        }
      });
      await prisma.userCourses.create({
        data: {
          user_id: createdUser.id
        }
      });
      await prisma.userPayments.create({
        data: {
          user_id: createdUser.id
        }
      });

      return createdUser;
    });
  };

  asignStudent = async (user_id, payload) => {
    return await this.db.$transaction(async (prisma) => {
      const data = await this.db.users.update({
        where: {
          id: user_id,
        },
        data: payload
      });

      return data;
    })
  };

  asignMother = async (user_id, payload) => {
    return await this.db.$transaction(async (prisma) => {
      const data = await this.db.userMothers.update({
        where: {
          user_id,
        },
        data: payload
      });

      return data;
    })
  };

  asignFather = async (user_id, payload) => {
    return await this.db.$transaction(async (prisma) => {
      const data = await prisma.userFathers.update({
        where: {
          user_id: parseInt(user_id),
        },
        data: payload
      });

      return data;
    })
  };

  asignGuardian = async (user_id, payload) => {
    const { is_parent_date } = payload;

    return await this.db.$transaction(async (prisma) => {
      const rawMother = await prisma.userMothers.findUnique({
        where: {
          user_id
        }
      })

      if (!rawMother.name || !rawMother.job || !rawMother.income || !rawMother.birth_place || !rawMother.birth_date || !rawMother.religion || !rawMother.phone) {
        throw new Forbidden('Anda belum mengisi Data Ibu')
      }

      if (!is_parent_date) {
        await prisma.userGuardians.update({
          where: {
            user_id
          },
          data: {
            is_parent_date,
            name: null,
            job: null,
            income: null,
            birth_place: null,
            birth_date: null,
            religion: null,
            phone: null,
          }
        });
      }

      const motherData = this.exclude(rawMother, ['id']);

      const data = await prisma.userGuardians.update({
        where: {
          user_id,
        },
        data: is_parent_date
          ? {
            is_parent_date,
            ...motherData,
          }
          : payload
      })

      return data;
    });
  }

  asignCourse = async (user_id, payload) => {
    const { name, level } = payload;

    return await this.db.$transaction(async (prisma) => {
      const course = await prisma.courses.findFirst({
        where: {
          name,
          level
        }
      })

      const data = await prisma.userCourses.update({
        where: {
          user_id
        },
        data: {
          course_id: course.id,
        }
      });

      return data;
    })
  }

  asignPayment = async (user_id, payload) => {
    return await this.db.$transaction(async (prisma) => {
      const data = await prisma.userPayments.update({
        where: {
          user_id
        },
        data: payload
      });

      return data;
    })
  }

  generateToken = async (id) => {
    const userData = await prisma.users.findFirst({
      where: { id },
    });
    if (!userData.apiToken) {
      const apiToken = crypto.randomBytes(32).toString('hex');
      const user = await prisma.users.update({
        where: { id },
        data: { apiToken },
      });
      return { apiToken: user.apiToken };
    } else return { apiToken: userData.apiToken };
  };
}

export default AuthenticationService;
