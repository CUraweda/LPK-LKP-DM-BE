import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import paymentService from './payment.service.js';

class paymentController extends BaseController {
    #service;

    constructor() {
        super();
        this.#service = new paymentService();
    }

    findRecapStatus = this.wrapper(async (req, res) => {
        const data = await this.#service.findRecapStatus();
        return this.ok(res, data, 'Banyak paymentHistory berhasil didapatkan');
    });

    findAll = this.wrapper(async (req, res) => {
        const data = await this.#service.findAll(req.query);
        return this.ok(res, data, 'Banyak paymentHistory berhasil didapatkan');
    });

    findById = this.wrapper(async (req, res) => {
        const data = await this.#service.findById(req.params.id);
        if (!data) throw new NotFound('paymentHistory tidak ditemukan');

        return this.ok(res, data, 'paymentHistory berhasil didapatkan');
    });

    notify = this.wrapper(async (req, res) => {
        const data = await this.#service.notifyPayment(req.params.id, { 
        status: req.headers['x-status']
        });
        return this.created(res, data, 'paymentHistory berhasil dibuat');
    });

    create = this.wrapper(async (req, res) => {
        const data = await this.#service.create(req.body);
        return this.created(res, data, 'paymentHistory berhasil dibuat');
    });

    createPayment = this.wrapper(async (req, res) => {
        const data = await this.#service.createPayment(req.body);
        return this.created(res, data, 'paymentHistory berhasil dibuat');
    });

    update = this.wrapper(async (req, res) => {
        const data = await this.#service.update(req.params.id, req.body);
        return this.ok(res, data, 'paymentHistory berhasil diperbarui');
    });

    delete = this.wrapper(async (req, res) => {
        const data = await this.#service.delete(req.params.id);
        return this.noContent(res, 'paymentHistory berhasil dihapus');
    });
}

export default paymentController;
