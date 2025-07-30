import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import facilitatorattendanceController from "./facilitatorattendance.controller.js";
import facilitatorattendanceValidator from "./facilitatorattendance.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = facilitatorattendanceValidator,
  controller = new facilitatorattendanceController();

r.get(
  "/show-all",
  auth(['ADMIN', "INSTRUKTUR", "PENGURUS"]),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id",
  auth(['ADMIN', "INSTRUKTUR", "PENGURUS"]),
  controller.findById);

r.post(
  "/create",
  uploader("/facilitator/attendance", "image", "ATTENDANCE").single("image"),
  auth(['ADMIN', "INSTRUKTUR", "PENGURUS"]),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.post(
  "/attend",
  uploader("/facilitator/attendance", "image", "ATTENDANCE").single("image"),
  auth(['ADMIN', "INSTRUKTUR", "PENGURUS"]),
  validatorMiddleware({ body: validator.attend }),
  controller.attend
);

r.put(
  "/update/:id",
  uploader("/facilitator/attendance", "image", "ATTENDANCE").single("image"),
  auth(['ADMIN', "INSTRUKTUR", "PENGURUS"]),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const facilitatorattendanceRouter = r;
export default facilitatorattendanceRouter;
