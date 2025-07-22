import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import locationController from "./location.controller.js";
import locationValidator from "./location.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = locationValidator,
  controller = new locationController();

r.get(
  "/show-all",
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

r.put(
  "/update/:id",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const locationRouter = r;
export default locationRouter;
