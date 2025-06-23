import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import membertestController from "./membertest.controller.js";
import membertestValidator from "./membertest.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = membertestValidator,
  controller = new membertestController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get("/show-by-exam/:id", controller.findByExam);

r.post(
  "/create",
  auth(['SISWA']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['SISWA']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);
  
r.delete("/delete/:id", auth(['SISWA', 'ADMIN']), controller.delete);

const membertestRouter = r;
export default membertestRouter;
