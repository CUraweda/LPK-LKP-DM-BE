import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { roleConstant } from '../../config/constant.js';
import BaseService from '../../base/service.base.js';
import prisma from '../../config/prisma.db.js';
import { BadRequest, Forbidden, NotFound } from '../../exceptions/catch.execption.js';
import { compare, hash } from '../../helpers/bcrypt.helper.js';
import { generateAccessToken, generateRefreshToken, generateResetPasswordToken } from '../../helpers/jwt.helper.js';
import base64url from 'base64url';
import EmailHelper from '../../helpers/email.helper.js';
import { access } from 'fs';

class AuthenticationService extends BaseService {
  constructor() {
    super(prisma);
    this.mailHelper = new EmailHelper()
  }

  login = async (payload) => {
    const user = await this.db.user.findUnique({
      where: { email: payload.email }, include: { role: { select: { code: true } }, member: { select: { id: true, profileImage: true, dataVerified: true, memberState: true  } } }
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const pwValid = await compare(payload.password, user.password);
    if (!pwValid) throw new BadRequest('Password tidak cocok');
    
    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { 
      user: this.exclude(user, ['password', 'forgetToken', 'forgetExpiry', 'role']), 
      ...((!user.member.dataVerified && (user.role.code != "ADMIN")) ? { access: false } : { access: true }),
      token: { access_token, refresh_token },
    };
  };

  refreshToken = async (refresh) => {
    const payload = jwt.decode(refresh);

    const user = await this.db.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new NotFound('Akun tidak ditemukan');

    const access_token = await generateAccessToken(user);
    const refresh_token = await generateRefreshToken(user)
    return { user: this.exclude(user, ['password', 'forgetToken', 'forgetExpiry', 'role']), token: { access_token, refresh_token } };
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

      const createdUser = await prisma.user.create({
        data: { roleId: findRole.id, email, password: await hash(password) }
      });

      const access_token = await generateAccessToken(createdUser);
      const refresh_token = await generateRefreshToken(createdUser)
      return { user: this.exclude(createdUser, ['password', 'forgetToken', 'forgetExpiry', 'role']), token: { access_token, refresh_token } };

    });
  };

  forgotPassword = async (payload) => {
    const user = await this.db.user.findUnique({ where: { email: payload.email }, include: { member: true } })
    if (!user) throw new BadRequest("Akun tidak ditemukan")
    const forgetToken = await generateResetPasswordToken(user.id);
    const forgetExpiry = new Date();
    forgetExpiry.setHours(forgetExpiry.getHours() + 1 - forgetExpiry.getTimezoneOffset() / 60);

    await this.db.user.update({ where: { id: user.id }, data: { forgetToken, forgetExpiry } })

    const encryptedToken = base64url.encode(forgetToken)
    const url = `${process.env.LPK_URL}/reset-password/${encryptedToken}`

    this.mailHelper.sendEmail(
      { url },
      payload.email,
      "LPK | Konfirmasi Lupa Password",
      "./src/email/views/reset_password.html",
      {
        member_name: user.member.name,
        
      }
      ["./src/email/assets/Logo.jpg"]
    );

    return "Email Lupa Password berhail terkirim, mohon tunggu!"
  }

  resetPassword = async (payload) => {
    const encodedToken = payload.encoded_email;
    const forgetToken = base64url.decode(encodedToken);
    const decoded = jwt.decode(forgetToken);
    const user = await this.db.user.findFirst({ where: { forgetToken, id: decoded.uid } });
    if (!user || user.forgetExpiry < new Date()) throw new BadRequest("Token kadaluwaras atau tidak valid");

    const hashedPassword = await hash(payload.new_password)
    await this.db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forgetToken: null,
        forgetExpiry: null,
      },
    });

    return 'Password berhasil diupdate! Mohon login kembali'
  }
}

export default AuthenticationService;
