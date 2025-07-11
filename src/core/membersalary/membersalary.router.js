import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import membersalaryController from "./membersalary.controller.js";
import membersalaryValidator from "./membersalary.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = membersalaryValidator,
  controller = new membersalaryController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get("/show-user/:id", controller.findByUser);

r.post(
  "/create",
  auth(['ADMIN', 'SISWA']),
  validatorMiddleware({ body: validator.createUpdate }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN', 'SISWA']),
  validatorMiddleware({ body: validator.createUpdate }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const membersalaryRouter = r;
export default membersalaryRouter;
