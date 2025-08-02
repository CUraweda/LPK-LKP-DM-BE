import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import materialController from "./material.controller.js";
import materialValidator from "./material.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import { uploadMany } from "../../middlewares/upload.middleware.js";

const r = Router(),
  validator = materialValidator,
  controller = new materialController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get("/show-training/:id", controller.findByTrainingId);

r.get(
  "/show-title/:q",
  controller.findByMateri
);

r.get(
  '/download/:id',
  auth(['ADMIN', 'USER']),
  controller.downloadPdf
);

r.post(
  "/create",
  auth(['ADMIN']),
  uploadMany('./uploads', '/materials', [
    {
      name: 'coverImage',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024
    },
    {
      name: 'filePdf',
      mimeTypes: ['application/pdf'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024
    }
  ]),
  validatorMiddleware({ body: validator.createUpdate }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  uploadMany('./uploads', '/materials', [
    {
      name: 'coverImage',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024
    },
    {
      name: 'filePdf',
      mimeTypes: ['application/pdf'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024
    }
  ]),
  validatorMiddleware({ body: validator.createUpdate }),
  controller.update
);
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const materialRouter = r;
export default materialRouter;
