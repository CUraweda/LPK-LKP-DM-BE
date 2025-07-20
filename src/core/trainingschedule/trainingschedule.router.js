import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import trainingscheduleController from "./trainingschedule.controller.js";
import trainingscheduleValidator from "./trainingschedule.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";

const r = Router(),
  validator = trainingscheduleValidator,
  controller = new trainingscheduleController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get("/show-by-member", controller.findByMember);

r.post(
  "/create",
  auth(['SISWA']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.post(
  "/pcreate",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.pCreate }),
  controller.pCreate
);
  
r.put(
  "/update/:id",
  auth(['ADMIN', 'SISWA']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);
    
r.delete(
  "/delete/:id", 
  auth(['ADMIN']),
  controller.delete
  );

const trainingscheduleRouter = r;
export default trainingscheduleRouter;
