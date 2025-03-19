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

    const findRoleStudent = await this.db.roles.findFirst({
      where: {
        name: { contains: '%siswa%' }
      }
    });

    if (!findRoleStudent) throw new NotFound('Tidak ada role student')

    const initUser = await this.db.users.create({
      data: {
        role_id: findRoleStudent.id
      }
    });

    const { email, password } = payload;

    const existing = await this.db.users.findUnique({ where: { email } });
    if (existing) throw new Forbidden('Akun dengan email telah digunakan');

    const createdUser = await this.db.users.update({
      where: {
        id: parseInt(initUser.id)
      },
      data: {
        email,
        password: await hash(password, 10),
      },
    });

    await this.db.userMothers.create({
      data: {
        user_id: createdUser.id
      }
    });
    await this.db.userFathers.create({
      data: {
        user_id: createdUser.id
      }
    });
    await this.db.userGuardians.create({
      data: {
        user_id: createdUser.id
      }
    });
    await this.db.userCourses.create({
      data: {
        user_id: createdUser.id
      }
    });
    await this.db.userPayments.create({
      data: {
        user_id: createdUser.id
      }
    });

    return createdUser;
  };

  asignStudent = async (user_id, payload) => {
    const data = await this.db.users.update({
      where: {
        id: user_id,
      },
      data: payload
    });

    return data;
  };

  asignMother = async (user_id, payload) => {
    const data = await this.db.userMothers.update({
      where: {
        user_id: parseInt(user_id),
      },
      data: payload
    });

    return data;
  };

  generateToken = async (id) => {
    const userData = await prisma.user.findFirst({
      where: { id },
    });
    if (!userData.apiToken) {
      const apiToken = crypto.randomBytes(32).toString('hex');
      const user = await prisma.user.update({
        where: { id },
        data: { apiToken },
      });
      return { apiToken: user.apiToken };
    } else return { apiToken: userData.apiToken };
  };
}

export default AuthenticationService;
