import CryptoJS from 'crypto-js';
import base64url from 'base64url';
import https from "https";
import path from "path"
import axios from "axios"
import cas from "ssl-root-cas"
import fs from "fs"

import Payment from "../../config/payment.js"
import { BadRequest, ServerError } from "../../exceptions/catch.execption.js"
import paymentValidator from "./payment.validator.js"
import { response } from 'express';

const rootCas = cas.create()
rootCas.addFile("secrets/public-payment.pem")

export class PaymentHelper {
    /**
     * 
     * @param {string} redirectPath 
     */
    constructor() {
        this.#pUrl = Payment.paymentUrl
        this.#bUrl = Payment.backendUrl
        this.#passphrase = "jdad313dn"
        this.#httpsAgent = new https.Agent({
            // rejectUnauthorized: false
            // ca: fs.readFileSync("secrets/public-payment.pem")
            ca: rootCas
        })
        this.#lpkPCODE = {
            code: "03",
            name: "LPK"
        }
    }

    pCurawedaUrl = {
        qris: {
            create: {
                name: "qris-create",
                path: "paylabs/qris/create",
                val: paymentValidator.createQris
            },
            inquiry: {
                name: "qris-inquiry",
                path: "paylabs/qris/query",
                val: paymentValidator.inquiryQris
            },
            // cancel: "paylabs/qris/cancel"
        },
        va: {
            create: {
                name: "va-create",
                path: "paylabs/payment/va/create",
                val: paymentValidator.createVa
            },
            // inquiry: {
            //     name: "va-inquiry",
            //     path: "paylabs/transfer-va/status",
            //     val: paymentValidator.inquiryVa
            // },
            // update: "paylabs/transfer-va/update-va"
        }
    }

    #pUrl; #bUrl; #lpkPCODE; #passphrase; #httpsAgent

    _encryptTID(tid) {
        return base64url.encode(CryptoJS.AES.encrypt(tid, this.#passphrase).toString())
    }

    _decryptTID(text) {
        const bytes = CryptoJS.AES.decrypt(base64url.decode(text), this.#passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    _checkMethod(method, usage) {
        if (method === "QRIS") {
            return this.pCurawedaUrl.qris[usage] || false
        } else if (method.includes("VA")) {
            return this.pCurawedaUrl.va[usage] || false
        } else return false
    }

    _parseDate(paymentData) {
        if (paymentData?.virtualAccountData) {
            return new Date(paymentData.virtualAccountData.expiredDate);
        } else if (paymentData?.expiredTime) {
            const str = paymentData.expiredTime;
            const formatted = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(8, 10)}:${str.slice(10, 12)}:${str.slice(12, 14)}`;
            return new Date(formatted);
        }
        return null;
    }

    async _formatBody(method, body) {
        const { val, name } = method
        switch (name) {
            case "qris-create":
                body['username'] = body.data.member.fullName,
                body['email'] = body.data.member.user.email,
                body['amount'] = body.data.paymentTotal.toString()
                body['productInfo'] = { id: this.#lpkPCODE.code, name: this.#lpkPCODE.name, type: `${this.#lpkPCODE.name}|${this.#lpkPCODE.name}|01`, quantity: 1 }
                body['productName'] = `${this.#lpkPCODE.name}|${this.#lpkPCODE.name}|01`
                break
                case "va-create":
                body['username'] = body.data.member.fullName,
                body['email'] = body.data.member.user.email,
                body['amount'] = body.data.paymentTotal.toString()
                body['productInfo'] = { id: this.#lpkPCODE.code, name: this.#lpkPCODE.name, type: `${this.#lpkPCODE.name}|${this.#lpkPCODE.name}|01`, quantity: 1 }
                body['productName'] = `${this.#lpkPCODE.name}|${this.#lpkPCODE.name}|01`
                break
        }
        const options = { abortEarly: false, allowUnknown: true, stripUnknown: true, };
        try {
            return await val.validateAsync(body, options)
        } catch (e) {
            console.log(e)
            throw new BadRequest("Body cannot be processed")
        }
    }

    //?============================= MAIN FUNCTION =======================
    async create(body) {
        const method = this._checkMethod(body.paymentType, "create")
        if (!method) throw new BadRequest("Invalid Payment Method")

        body['appUrl'] = `${this.#bUrl}/api/payment/notify/${this._encryptTID(body.transactionId)}`
        body = await this._formatBody(method, body)

        return await axios.post(`${this.#pUrl}/${method.path}`, body, { httpsAgent: this.#httpsAgent }).then((res) => {
            res.data['expiredDate'] = this._parseDate(res.data)
            return res.data
        }).catch((e) => {
            console.log(e)
            throw new ServerError("Error on payment server")
        })
    }

    async check(body) {
        const url = this._checkMethod(body.paymentType, "inquiry")
        if (!url) throw new BadRequest("Invalid Payment Method")

        await fetch(`${this.#pUrl}/${url}`, { method: "POST", body }).then((res) => {
            if (!res.ok) throw new BadRequest()
            return res.body
        }).catch((e) => { console.log(e) })
    }

    async cancel(body) {
        const url = this._checkMethod(body.paymentType, "cancel")
        if (!url) throw new BadRequest("Invalid Payment Method")

        await fetch(`${this.#pUrl}/${url}`, { method: "POST", body }).then((res) => {
            if (!res.ok) throw new BadRequest()
            return res.body
        }).catch((e) => { console.log(e) })
    }

    async updateVa(body) {
        const url = this._checkMethod(body.paymentType, "update")
        if (!url) throw new BadRequest("Invalid Payment Method")

        await fetch(`${this.#pUrl}/${url}`, { method: "PUT", body }).then((res) => {
            if (!res.ok) throw new BadRequest()
            return res.body
        }).catch((e) => { console.log(e) })
    }
}