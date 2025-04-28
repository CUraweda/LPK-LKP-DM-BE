import { Router } from "express";
import memberparentController from "./memberparent.controller.js";
import memberparentValidator from "./memberparent.validator.js";
import { baseValidator } from "../../../base/validator.base.js";
import validatorMiddleware from "../../../middlewares/validator.middleware.js";
import auth from "../../../middlewares/auth.middleware.js";

const r = Router(),
  validator = memberparentValidator,
  controller = new memberparentController();

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

const memberparentRouter = r;
export default memberparentRouter;
