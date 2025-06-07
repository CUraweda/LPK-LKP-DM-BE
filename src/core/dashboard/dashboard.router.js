import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import dashboardController from "./dashboard.controller.js";
import dashboardValidator from "./dashboard.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = dashboardValidator,
  controller = new dashboardController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-arrange", controller.findArrange);
r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  uploader("/dashboard", "image", "PP").single("image"),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  uploader("/dashboard", "image", "PP").single("image"),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const dashboardRouter = r;
export default dashboardRouter;
