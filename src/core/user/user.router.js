import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import userController from "./user.controller.js";
import userValidator from "./user.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = userValidator,
  controller = new userController();

r.get(
  "/show-all",
  auth(['ADMIN']),
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get(
  "/show-by-name",
  auth(['ADMIN']),
  controller.findByName
);

r.get(
  "/show-one/:id",
  auth(['ADMIN']),
  controller.findById
);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);
r.post(
  "/create-admin",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create_admin }),
  controller.createAdmin
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.put(
  "/update-admin/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.updateAdmin }),
  controller.updateAdmin
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const userRouter = r;
export default userRouter;
