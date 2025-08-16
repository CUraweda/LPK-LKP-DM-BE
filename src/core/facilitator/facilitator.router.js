import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import facilitatorController from "./facilitator.controller.js";
import facilitatorValidator from "./facilitator.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = facilitatorValidator,
  controller = new facilitatorController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get(
  "/show-me",
  auth(["INSTRUKTUR", "PENGURUS"]),
  controller.findMe
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(["ADMIN"]),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.post(
  "/generate-one",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.generate }),
  controller.generateOne
);

r.put(
  "/update/:id",
  auth(["ADMIN", "INSTRUKTUR", "PENGURUS"]),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const facilitatorRouter = r;
export default facilitatorRouter;
