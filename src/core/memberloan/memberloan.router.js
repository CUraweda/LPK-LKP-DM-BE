import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import memberloanController from "./memberloan.controller.js";
import memberloanValidator from "./memberloan.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = memberloanValidator,
  controller = new memberloanController();

r.get(
  "/show-all",
  auth(['ADMIN', 'SISWA']),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.post(
  "/generate",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.generate }),
  controller.generateLoan
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const memberloanRouter = r;
export default memberloanRouter;
