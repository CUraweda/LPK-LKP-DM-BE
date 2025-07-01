import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import chatrecapController from "./chatrecap.controller.js";
import chatrecapValidator from "./chatrecap.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = chatrecapValidator,
  controller = new chatrecapController();

r.get(
  "/show-all",
  auth(['ADMIN']),
  validatorMiddleware({ query: baseValidator.browseQuery, option: { stripUnknown: false } }),
  controller.findAll
);

r.get("/show-one/:id",
  auth(['ADMIN']),
   controller.findById);
r.get(
  "/read-message/:id",
  auth(['ADMIN', 'SISWA']),
  controller.readMessage
);

r.get(
  "/show-messages/:id?",
  auth(['ADMIN', 'SISWA']),
  controller.findMessages
)

r.get(
  "/show-all-new",
  auth(['ADMIN']),
  controller.findAllNew
);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const chatrecapRouter = r;
export default chatrecapRouter;
