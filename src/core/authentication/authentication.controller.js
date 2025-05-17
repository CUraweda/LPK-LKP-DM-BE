import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import AuthenticationService from './authentication.service.js';

class AuthenticationController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new AuthenticationService();
  }

login = this.wrapper(async (req, res) => {
    const data = await this.#service.login(req.body);
    return this.ok(res, data, 'Berhasil login!');
  });

  refresh = this.wrapper(async (req, res) => {
    const data = await this.#service.refreshToken(req.body.refresh_token);
    return this.ok(res, data, 'Berhasil login!');
  });

  register = this.wrapper(async (req, res) => {
    const data = await this.#service.register(req.body);
    return this.ok(res, data, 'Berhasil mendaftarkan Email dan Password! silakan lanjutkan step');
  });

  forgotPassword = this.wrapper(async (req, res) => {
    const data = await this.#service.forgotPassword(req.body);
    return this.ok(res, data, 'Berhasil melakukan request lupa password akun! Tunggu email untuk step selanjutnya');
  });

  resetPassword = this.wrapper(async (req, res) => {
    const data = await this.#service.resetPassword(req.body);
    return this.ok(res, data, 'Berhasil melakukan request lupa password akun! Tunggu email untuk step selanjutnya');
  });

}

export default AuthenticationController;
