import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import chatController from "./chat.controller.js";
import chatValidator from "./chat.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = chatValidator,
  controller = new chatController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);
r.get("/count-recap", auth(['ADMIN']), controller.countRecap);
r.get("/show-me", auth(['ADMIN', 'SISWA']), controller.findByUser)

r.post(
  "/send-admin",
  auth(['ADMIN']),
  uploader("/chat", "*", "CT"). single("fSend"),
  validatorMiddleware({ body: validator.create }),
  controller.sendAdmin
);
r.post(
  "/send",
  auth(['SISWA']),
  uploader("/chat", "*", "CT").single("fSend"),
  validatorMiddleware({ body: validator.send }),
  controller.send
)

r.put(
  "/update/:id",
  auth(['ADMIN']),
  uploader("/chat", "*", "CT").single("fSend"),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const chatRouter = r;
export default chatRouter;
