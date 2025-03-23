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
  '/asign-student/:id',
  validatorMiddleware({ body: validator.asignStudent }),
  controller.asignStudent
);

r.post(
  '/asign-mother/:id',
  validatorMiddleware({ body: validator.asignMotherAndFather }),
  controller.asignMother
);

r.post(
  '/asign-father/:id',
  validatorMiddleware({ body: validator.asignMotherAndFather }),
  controller.asignFather
);

r.post(
  '/asign-guardian/:id',
  validatorMiddleware({ body: validator.asignGuardian }),
  controller.asignGuardian
);

r.post(
  '/asign-course/:id',
  validatorMiddleware({ body: validator.asignCourse }),
  controller.asignCourse
);

r.post(
  '/asign-payment/:id',
  validatorMiddleware({ body: validator.asignCourse }),
  controller.asignPayment
);

r.get('/generate-token', auth(), controller.generateToken);

const authenticationRouter = r;
export default authenticationRouter;
