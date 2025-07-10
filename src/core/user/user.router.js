import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import userController from "./user.controller.js";
import userValidator from "./user.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = userValidator,
  controller = new userController();

r.get(
  "/show-all",
  auth(['ADMIN']),
  validatorMiddleware({ query: baseValidator.browseQuery, option: { stripUnknown: false } }),
  controller.findAll
);

r.get(
  "/show-one/:id",
  auth(['ADMIN']),
  controller.findById
);

r.get(
  '/count',
  auth(['ADMIN']),
  controller.count
)

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),

  controller.create
);
r.post(
  "/create-admin",
  auth(['ADMIN']),
  uploader("/user", "image", "PP").single("profilePict"),
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
  uploader("/user", "image", "PP").single("profilePict"),
  validatorMiddleware({ body: validator.updateAdmin }),
  controller.updateAdmin
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const userRouter = r;
export default userRouter;
