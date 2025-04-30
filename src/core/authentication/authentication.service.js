import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { roleConstant } from '../../config/constant.js';
import BaseService from '../../base/service.base.js';
import prisma from '../../config/prisma.db.js';
import { BadRequest, Forbidden, NotFound } from '../../exceptions/catch.execption.js';
import { compare, hash } from '../../helpers/bcrypt.helper.js';
import { generateAccessToken, generateRefreshToken } from '../../helpers/jwt.helper.js';
import { connect } from 'http2';

class AuthenticationService extends BaseService {
  constructor() {
    super(prisma);
  }

  login = async (payload) => {
    const user = await this.db.user.findUnique({
      where: { email: payload.email }, include: { member: true }
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const pwValid = await compare(payload.password, user.password);
    if (!pwValid) throw new BadRequest('Password tidak cocok');
    // if (!user.member.dataVerified) throw new Forbidden("Pendaftaran member belum selesai")

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { user: this.exclude(user, ['password', 'apiToken', 'isVerified']), token: { access_token, refresh_token } };
  };

  refreshToken = async (refresh) => {
    const payload = jwt.decode(refresh);

    const user = await this.db.user.findUnique({
      where: { email: payload.email },
    });
  if (!user) throw new NotFound('Akun tidak ditemukan');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { user: this.exclude(user, ['password', 'apiToken', 'isVerified']), token: { access_token, refresh_token } };
  };

  findUserById = async (id) => {
    const data = await this.db.user.findUnique({
      where: { id }
    });
    return this.exclude(data, ['password']);
  };

  register = async (payload) => {
    const { email, password } = payload;

    return this.db.$transaction(async (prisma) => {
      const findRole = await prisma.role.findFirst({
        where: { identifier: roleConstant.STUDENT_CODE }
      });
      if (!findRole) throw new NotFound('Tidak ada role siswa')
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Forbidden('Akun dengan email telah digunakan');

      const initMember = await prisma.member.create()
      const createdUser = await prisma.user.create({
        data: { roleId: findRole.id, email, password: await hash(password), memberId: initMember.id }
      });

      return createdUser;
    });
  };

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
