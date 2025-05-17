import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import memberController from "./member.controller.js";
import memberValidator from "./member.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = memberValidator,
  controller = new memberController();

r.get(
  "/show-all",
  auth(["ADMIN"]),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", 
  auth(["ADMIN"]),
  controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);
r.patch(
  "/change/verified",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.patchVerified }),
  controller.create
)
r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

r.post(
  "/extend-user-data-siswa/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_siswa }),
  controller.extendDataSiswa
)
r.post(
  "/extend-user-data-ibu/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_ibu }),
  controller.extendDataIbu
)
r.post(
  "/extend-user-data-ayah/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_ayah }),
  controller.extendDataAyah
)
r.post(
  "/extend-user-data-wali/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_wali }),
  controller.extendDataWali
)
r.post(
  "/extend-user-data-kursus/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_kursus }),
  controller.extendDataTraining
)
r.post(
  "/extend-user-data-pembayaran/:id?",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.extend_data_pembayaran }),
  controller.extendDataPembayaran
)

const memberRouter = r;
export default memberRouter;
