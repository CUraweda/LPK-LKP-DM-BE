import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import chatController from "./chat.controller.js";
import chatValidator from "./chat.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = chatValidator,
  controller = new chatController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);
r.get("/show-me", auth(['ADMIN', 'SISWA']), controller.findByUser)

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);
r.post(
  "/send",
  auth(['SISWA']),
  validatorMiddleware({ body: validator.send }),
  controller.send
)

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const chatRouter = r;
export default chatRouter;
