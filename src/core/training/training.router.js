import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import trainingController from "./training.controller.js";
import trainingValidator from "./training.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import { uploadMany } from "../../middlewares/upload.middleware.js";

const r = Router(),
  validator = trainingValidator,
  controller = new trainingController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  uploadMany('./uploads', '/training-images', [
    {
      name: 'trainingImage',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024,
    },
  ]),
  validatorMiddleware({ body: validator.createUpdate }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  uploadMany('./uploads', '/training-images', [
    {
      name: 'trainingImage',
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      maxCount: 1,
      limitSize: 10 * 1024 * 1024,
    },
  ]),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.put("/update-status/:id", auth(['ADMIN']),controller.updateStatus);
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const trainingRouter = r;
export default trainingRouter;
