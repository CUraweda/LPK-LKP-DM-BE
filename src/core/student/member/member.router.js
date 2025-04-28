import { Router } from "express";
import memberController from "./member.controller.js";
import memberValidator from "./member.validator.js";
import { baseValidator } from "../../../base/validator.base.js";
import validatorMiddleware from "../../../middlewares/validator.middleware.js";
import auth from "../../../middlewares/auth.middleware.js";

const r = Router(),
  validator = memberValidator,
  controller = new memberController();

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

const memberRouter = r;
export default memberRouter;
