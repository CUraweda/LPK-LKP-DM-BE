import { Router } from "express";
import materialController from "./material.controller.js";
import materialValidator from "./material.validator.js";

import { baseValidator } from "../../../base/validator.base.js";
import validatorMiddleware from "../../../middlewares/validator.middleware.js";
import auth from "../../../middlewares/auth.middleware.js";
const r = Router(),
  validator = materialValidator,
  controller = new materialController();

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

const materialRouter = r;
export default materialRouter;
