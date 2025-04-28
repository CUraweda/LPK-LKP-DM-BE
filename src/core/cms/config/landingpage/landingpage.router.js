import { Router } from "express";
import auth from "../../../../middlewares/auth.middleware.js";
import validatorMiddleware from "../../../../middlewares/validator.middleware.js";
import landingPageController from "./landingpage.controller.js";
import landingPageValidator from "./landingpage.validator.js";

const r = Router(),
  validator = landingPageValidator,
  controller = new landingPageController();

// //? BEGIN > HERO BANNER
// r.get(
//   "/hero-banner/:id",
//   auth(['ADMIN']),
//   controller.showHeroBanner
// );
// r.post(
//   "/hero-banner",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.heroBanner }),
//   controller.createHeroBanner
// );
// r.put(
//   "/hero-banner",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.heroBanner }),
//   controller.updateHeroBanner
// );
// r.delete(
//   "/hero-banner",
//   auth(['ADMIN']),
//   controller.deleteHeroBanner
// );
// //? END > HERO BANNER

// r.put(
//   "/about-us",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/vision",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/mission",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/confidence-achievement",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/training",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/team",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/student-creation",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/testimonial",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/industry",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/faq",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/footer",
//   auth(['ADMIN']),
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const landingpageRouter = r;
export default landingpageRouter;
