import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import memberattendanceController from "./memberattendance.controller.js";
import memberattendanceValidator from "./memberattendance.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = memberattendanceValidator,
  controller = new memberattendanceController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/attend",
  auth(['SISWA', 'ADMIN']),
  validatorMiddleware({ body: validator.attend }),
  controller.attend
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

const memberattendanceRouter = r;
export default memberattendanceRouter;
