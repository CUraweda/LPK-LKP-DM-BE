import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import trainingCategoryController from "./trainingcategory.controller.js";
import trainingCategoryValidator from "./trainingcategory.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = trainingCategoryValidator,
  controller = new trainingCategoryController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  uploader("/training-category", "image", "PP").single("image"),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  auth(['ADMIN']),
  uploader("/training-category", "image", "PP").single("image"),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const trainingcategoryRouter = r;
export default trainingcategoryRouter;
