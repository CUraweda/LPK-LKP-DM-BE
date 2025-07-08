import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import memberattendanceController from "./memberattendance.controller.js";
import memberattendanceValidator from "./memberattendance.validator.js";
import { baseValidator } from "../../base/validator.base.js";
import auth from "../../middlewares/auth.middleware.js";
import uploader from "../../middlewares/multer.middleware.js";

const r = Router(),
  validator = memberattendanceValidator,
  controller = new memberattendanceController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery, option: { stripUnknown: false } }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.get(
  "/show-my-recap",
  auth(['SISWA', 'ADMIN']),
  controller.myRecap
);

r.get(
  "/show-me",
  auth(['SISWA', 'ADMIN']),
  controller.findMe
);

r.get(
  "/show-chart",
  auth(['SISWA', 'ADMIN']),
  controller.showChart
);

r.get(
  "/count-all",
  auth(['ADMIN']),
  controller.countAll
)

r.post(
  "/attend",
  auth(['SISWA', 'ADMIN']),
  uploader("/member/attendance", "image", "ATTENDANCE" ).single("image"),
  validatorMiddleware({ body: validator.attend }),
  controller.attend
);

r.post(
  "/range-data",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.rangeData }),
  controller.findRange
);


r.post(
  "/create",
  auth(['ADMIN']),
  uploader("/member/attendance", "image", "ATTENDANCE" ).single("image"),
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

const memberattendanceRouter = r;
export default memberattendanceRouter;
