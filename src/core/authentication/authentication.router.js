import { Router } from "express";
import auth from "../../middlewares/auth.middleware.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AuthenticationController from "./authentication.controller.js";
import AuthenticationValidator from "./authentication.validator.js";

const r = Router(),
  validator = AuthenticationValidator,
  controller = new AuthenticationController()

r.post(
  "/login",
  validatorMiddleware({ body: validator.login }),
  controller.login
);

r.post(
  '/refresh',
  validatorMiddleware({ body: validator.refresh }),
  controller.refresh
);

r.post(
  '/register',
validatorMiddleware({ body: validator.register }),
controller.register
);

r.post(
  '/forgot-pass',
  validatorMiddleware({ body: validator.forgotPassword }),
  controller.forgotPassword
)
r.put(
  "/reset-pass",
  validatorMiddleware({ body: validator.resetPass }),
  controller.resetPassword
)

const authenticationRouter = r;
export default authenticationRouter;

