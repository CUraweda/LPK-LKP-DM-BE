import BaseService from "../../base/service.base.js";
import prisma from '../../config/prisma.db.js';
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import archiver from "archiver";

class membertestService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformBrowseQuery(query);
    const data = await this.db.memberTest.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.memberTest.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.findUnique({ where: { id: convertId } });
    return data;
  };

  findByExam = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.findMany({ where: { examId: convertId } });
    return data;
  };

  exportOne = async (id) => {
    const convertId = Number(id);
    const memberTest = await this.db.memberTest.findUnique({ where: { id: convertId } });

    if (!memberTest || !memberTest.pdfPath) return { filePath: null, fileName: null };

    const relativePath = memberTest.pdfPath.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'uploads', relativePath);

    if (!fs.existsSync(filePath)) return { filePath: null, fileName: null };

    const fileName = path.basename(filePath);
    return { filePath, fileName };
  };

  exportExam = async (examId) => {
    const memberTests = await this.db.memberTest.findMany({
      where: { examId },
      select: { pdfPath: true }
    });

    const files = memberTests
      .filter(mt => mt.pdfPath)
      .map(mt => {
        const relativePath = mt.pdfPath.replace('/uploads/', '');
        const filePath = path.join(process.cwd(), 'uploads', relativePath);
        return fs.existsSync(filePath) ? filePath : null;
      })
      .filter(Boolean);

    if (!files.length) {
      return {
        success: false,
        message: "PDF belum tersedia untuk membertest ini",
        data: null
      };
    }

    if (files.length === 1) {
      return {
        success: true,
        message: "PDF ditemukan",
        data: {
          filePath: files[0],
          fileName: path.basename(files[0])
        }
      };
    }

    const archiver = (await import("archiver")).default;
    const zipName = `membertest-exam-${examId}.zip`;
    const zipPath = path.join(process.cwd(), "uploads", "memberwork", zipName);

    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

    const archive = archiver("zip", { zlib: { level: 9 } });
    const output = fs.createWriteStream(zipPath);

    await new Promise((resolve, reject) => {
      archive.pipe(output);
      files.forEach(file => {
        archive.file(file, { name: path.basename(file) });
      });
      archive.finalize();
      output.on("close", resolve);
      archive.on("error", reject);
    });

    return {
      success: true,
      message: "ZIP PDF berhasil dibuat",
      data: {
        filePath: zipPath,
        fileName: zipName
      }
    };
  };

  create = async (payload) => {
    const startTime = new Date()
    const payload_data = {
      ...payload,
      startTime
    }
    const data = await this.db.memberTest.create({ data: payload_data });
    return data;
  };

  update = async (id, payload) => {
    const convertId = Number(id);
    const finishedAt = new Date();
    const payload_data = {
      ...payload,
      finishedAt
    };

    if (payload.status === "Selesai") {
      const memberTest = await this.db.memberTest.findUnique({
        where: { id: convertId },
        include: {
          member: true,
          exam: { include: { training: true } }
        }
      });

      if (!memberTest) throw new Error("MemberTest tidak ditemukan");

      const uploadsDir = path.join(process.cwd(), "uploads", "memberwork");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const fileName = `membertest-${convertId}-${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(fs.createWriteStream(filePath));

      const exam = memberTest.exam;
      const member = memberTest.member;
      const training = exam.training;
      const questions = exam.questions || [];
      const answers = payload.answer || [];

      const answeredCount = payload.questionsCompleted || 0;
      const totalTime = exam.totalHours * 60;
      const timeUsed = Math.floor((payload.secondsCompleted || 0) / 60);

      doc.font('Helvetica-Bold').fontSize(18).text(`Nama ${exam.title}`, {
        align: "center"
      });

      doc.moveDown(1);
      
      const leftX = doc.x;
      const rightX = leftX + 250;

      doc.font('Helvetica').fontSize(14).text(`Nama Siswa : ${member?.name || "Siswa"}`, leftX);
      doc.text(`Nama Pelatihan : ${training.title}`, rightX, doc.y - 15);
      doc.moveDown(0.5);
      doc.text(`Total Soal : ${exam.totalQuestions}`, leftX);
      doc.text(`Total Waktu : ${exam.totalHours * 60} Menit`, rightX, doc.y - 15);
      doc.moveDown(0.5);
      doc.text(`Soal Dikerjakan : ${answeredCount}`, leftX);
      doc.text(`Waktu Dihabiskan : ${timeUsed} Menit`, rightX, doc.y - 15);
      doc.moveDown(2);
      doc.x = leftX;

      questions.forEach((q, idx) => {
        doc.font("Helvetica-Bold").text(`${idx + 1}. ${q.question}`);
        doc.moveDown(0.5)
        const ans = answers.find(a => a.index === q.index);
        if (ans?.answer) {
          const answerLines = ans.answer.split(/\n|•|-|\d\./).filter(Boolean);
          answerLines.forEach((line, i) => {
            doc.font("Helvetica").text(`${i + 1}. ${line.trim()}`, {
              indent: 20
            });
          });
        } else {
          doc.font("Helvetica").text("Jawaban: -", { indent: 20 });
        }
        doc.moveDown();
      });

      doc.end();

      payload_data.pdfPath = `/uploads/memberwork/${fileName}`;
    }

    const data = await this.db.memberTest.update({
      where: { id: convertId },
      data: payload_data
    });

    return data;
  };

  delete = async (id) => {
    const convertId = Number(id)
    const data = await this.db.memberTest.delete({ where: { id: convertId } });
    return data;
  };
}

export default membertestService;  
