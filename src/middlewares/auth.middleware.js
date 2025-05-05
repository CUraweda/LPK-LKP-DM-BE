import httpStatus from 'http-status-codes';
import prisma from '../config/prisma.db.js';
import { Unauthenticated } from '../exceptions/catch.execption.js';
import { ApiError } from '../exceptions/errors.exception.js';
import { verifyToken } from '../helpers/jwt.helper.js';

export default function auth(roles) {
  return async (req, res, next) => {
    try {
      // Ekstrak token dari header authorization
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please Authenticate'
          )
        );
      }

      const parts = authHeader.split(' ');
      const token = parts[1];
      if (!token) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_AUTHORIZATION',
            'Please Authenticate'
          )
        );
      }

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (e) {
        // Jika token tidak valid atau telah expired, lempar error
        return next(new Unauthenticated('Invalid or expired token'));
      }

      // Cari user berdasarkan decoded token
      const user = await prisma.user.findFirst({
        where: { id: decoded.userId },
        include: { role: true, member: true } // Ambil relasi roles
      });

      if (!user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_DATA',
            'Please Authenticate'
          )
        );
      }

      // Jika parameter roles disediakan, periksa apakah user memiliki role yang sesuai
      if (roles && roles.length > 0) {
        const userRoleCodes = user.role.code
        const hasAccess = roles.some(allowedRole => userRoleCodes == allowedRole);
        if (!hasAccess) {
          return next(
            new ApiError(
              httpStatus.FORBIDDEN,
              'NO_ACCESS',
              'Unauthorized'
            )
          );
        }
      }

      req.user = user;
      next();
    } catch (e) {
      if (e.message === 'jwt expired') {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            'NO_ACCESS',
            'Expired Login Session'
          )
        );
      }
      console.error(e);
      return next(e);
    }
  };
}
