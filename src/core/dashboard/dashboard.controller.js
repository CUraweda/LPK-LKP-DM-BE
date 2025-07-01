import BaseController from "../../base/controller.base.js";
import { NotFound } from "../../exceptions/catch.execption.js";
import dashboardService from "./dashboard.service.js";

class dashboardController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new dashboardService();
  }

  formatSection = (sectionID) => {
    switch (sectionID) {
      case "HERO_BANNER": return "Hero Banner";
      case "TENTANG_KAMI": return "Tentang Kami";
      case "VISI": return "Visi";
      case "MISI": return "Misi";
      case "KEPERCAYAAN_PRESTASI": return "Kepercayaan & Prestasi";
      case "PROGRAM_PELATIHAN": return "Program Pelatihan";
      case "TIM": return "Tim";
      case "KARYA_SISWA": return "Karya Siswa";
      case "TESTIMONI": return "Testimoni";
      case "INDUSTRI": return "Industri";
      case "FAQ": return "FAQ";
      case "FOOTER": return "Footer";
      default: return sectionID; 
    }
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Banyak dashboard berhasil didapatkan");
  });

  findArrange = this.wrapper(async (req, res) => {
    const data = await this.#service.findArrange();
    return this.ok(res, data, "Banyak dashboard berhasil didapatkan");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (!data) throw new NotFound("dashboard tidak ditemukan");

    return this.ok(res, data, "dashboard berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    if (req.file) req.body['image'] = req.file.path
    req.body['sectionName'] = this.formatSection(req.body['sectionID'])
    const data = await this.#service.create(req.body);
    return this.created(res, data, "dashboard berhasil dibuat");
  });
  
  update = this.wrapper(async (req, res) => {
    if (req.file) req.body['image'] = req.file.path
    req.body['sectionName'] = this.formatSection(req.body['sectionID'])
    const data = await this.#service.update(+req.params.id, req.body);
    return this.ok(res, data, "dashboard berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, "dashboard berhasil dihapus");
  });
}

export default dashboardController;
