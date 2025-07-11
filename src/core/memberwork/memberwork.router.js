import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import memberworkController from "./memberwork.controller.js";
import memberworkValidator from "./memberwork.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import { uploadMany } from "../../middlewares/upload.middleware.js";

const r = Router(),
  validator = memberworkValidator,
  controller = new memberworkController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get("/show-user/:id", controller.findByUser);

r.post(
  '/create',
  auth(['ADMIN', 'SISWA']),
  uploadMany('./uploads', '/company-logos', [
    {
      name: 'companyLogo',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024,
    },
  ]),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN', 'SISWA']),
  uploadMany('./uploads', '/company-logos', [
    {
      name: 'companyLogo',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024,
    },
  ]),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const memberworkRouter = r;
export default memberworkRouter;
