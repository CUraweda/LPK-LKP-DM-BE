import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import membercertificateController from "./membercertificate.controller.js";
import membercertificateValidator from "./membercertificate.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = membercertificateValidator,
  controller = new membercertificateController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get(
  "/show-me",
  auth(['SISWA', 'ADMIN']),
  controller.findMe
)

r.get(
  "/count",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.count
);

r.post(
  "/create",
  auth(['ADMIN']),
  uploader("/member/certificate", "file", "CERTIFICATE").single("image"),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  uploader("/member/certificate", "file", "CERTIFICATE").single("image"),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.get(
  "/download/:id",
  auth(['ADMIN', "SISWA"]),
  controller.download
)
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const membercertificateRouter = r;
export default membercertificateRouter;
