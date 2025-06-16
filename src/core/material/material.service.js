import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import path from "path"
import fs from "fs"

class materialService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.material.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.material.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id);
    const data = await this.db.material.findUnique({ where: { id: convertId } });
    return data;
  };

  downloadPdf = async (id) => {
    try {
      const material = await this.findById(id);
      if (!material || !material.link) {
        throw new NotFound("Material atau file PDF tidak ditemukan");
      }

      const relativePath = material.link.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'uploads', relativePath);

      if (!fs.existsSync(filePath)) {
        throw new NotFound("File tidak ditemukan di server");
      }

      const fileName = path.basename(relativePath);

      return { filePath, fileName };
    } catch (error) {
      console.log(error)
    }
  }

  create = async (body, files) => {
    try {
      const coverImage = files?.coverImage?.[0];
      const filePdf = files?.filePdf?.[0];

      if (!coverImage || !filePdf) {
        throw new Error('Gambar atau file PDF tidak ditemukan');
      }

      const payload = {
        ...body,
        trainingId: Number(body.trainingId),
        coverImage: `/uploads/materials/${coverImage.filename}`,
        link: `/uploads/materials/${filePdf.filename}`,
        size: (filePdf.size / 1024).toFixed(2) + ' KB'
      };

      const data = await this.db.material.create({ data: payload });
      return data;
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  };

  update = async (id, body, files) => {
    const oldMaterial = await this.findById(id);
    if (!oldMaterial) throw new Error("Material tidak ditemukan");

    const coverImage = files?.coverImage?.[0];
    const filePdf = files?.filePdf?.[0];

    const payload = {
      ...body,
      ...(coverImage && {
        coverImage: `/uploads/materials/${coverImage.filename}`
      }),
      ...(filePdf && {
        link: `/uploads/materials/${filePdf.filename}`,
        size: (filePdf.size / 1024).toFixed(2) + ' KB'
      }),
      ...(body.trainingId && {
        trainingId: Number(body.trainingId)
      })
    };

    // Hapus file lama jika diganti
    if (coverImage && oldMaterial.coverImage) {
      const oldPath = path.join(process.cwd(), 'uploads', oldMaterial.coverImage.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (filePdf && oldMaterial.link) {
      const oldPath = path.join(process.cwd(), 'uploads', oldMaterial.link.replace('/uploads/', ''));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const data = await this.db.material.update({
      where: { id: Number(id) },
      data: payload
    });

    return data;
  };

  delete = async (id) => {
    const material = await this.findById(id);
    if (!material) throw new Error("Material tidak ditemukan");

    if (material.coverImage) {
      const coverPath = path.join(process.cwd(), 'uploads', material.coverImage.replace('/uploads/', ''));
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    if (material.link) {
      const pdfPath = path.join(process.cwd(), 'uploads', material.link.replace('/uploads/', ''));
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    const deleted = await this.db.material.delete({
      where: { id: Number(id) }
    });

    return deleted;
  };
}

export default materialService;  
