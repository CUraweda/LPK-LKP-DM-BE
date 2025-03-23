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

  asignStudent = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignStudent(user.id, req.body);

    return this.ok(res, data, 'Berhasil mendaftarkan Data Siswa! silakan lanjutkan step');
  });

  asignMother = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignMother(user.id, req.body);

    return this.ok(res, data, 'Berhasil mendaftarkan Data Ibu! silakan lanjutkan step');
  });

  asignFather = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignFather(user.id, req.body);

    return this.ok(res, data, 'Berhasil mendaftarkan Data Ayah! silakan lanjutkan step');
  });

  asignGuardian = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignGuardian(user.id, req.body);

    return this.ok(res, data, 'Berhasil mendaftarkan Data Wali! silakan lanjutkan step');
  });

  asignCourse = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignCourse(user.id, req.body);

    return this.ok(res, data, 'Berhasil mendaftarkan Data Kursus! silakan lanjutkan step');
  });

  asignPayment = this.wrapper(async (req, res) => {
    const user = await this.#service.findUserById(parseInt(req.params.id));
    if (!user) throw new NotFound('User tidak ditemukan');

    const data = await this.#service.asignPayment(user.id, req.body);

    return this.ok(res, data, 'Berhasil melakukan pembayaran!');
  });

  generateToken = this.wrapper(async (req, res) => {
    const data = await this.#service.generateToken(req.user.userId);
    return this.ok(res, data, 'Berhasil generate token');
  });
}

export default AuthenticationController;
