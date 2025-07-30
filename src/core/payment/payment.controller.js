import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../exceptions/catch.execption.js';
import paymentService from './payment.service.js';

class paymentController extends BaseController {
    #service;

    constructor() {
        super();
        this.#service = new paymentService();
    }
    
    findMe = this.wrapper(async (req, res) => {
        const data = await this.#service.findMe(req.user)
        if (!data) throw new NotFound('Pembayaran tidak ditemukan');

        return this.ok(res, data, 'Pembayaran berhasil didapatkan');
    });

    findAll = this.wrapper(async (req, res) => {
        const data = await this.#service.findAll(req.query);
        return this.ok(res, data, "Banyak pendapatan berhasil didapatkan");
    });

    showChart = this.wrapper(async (req, res) => {
        const data = await this.#service.showChart(req.query);
        return this.ok(res, data, "Banyak pendapatan berhasil didapatkan");
    });

    notify = this.wrapper(async (req, res) => {
        const data = await this.#service.notifyPayment(req.params.id, { 
        status: req.headers['x-status']
        });
        return this.created(res, data, 'Pembayaran berhasil dibuat');
    });

    createPayment = this.wrapper(async (req, res) => {
        req.body['user'] = req.user
        if(!req.body['memberId']) req.body['memberId'] = req.user.memberId
        const data = await this.#service.createPayment(req.body);
        return this.created(res, data, 'Pembayaran berhasil dibuat');
    });
}

export default paymentController;
