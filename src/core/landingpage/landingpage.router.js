import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
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
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/vision",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/mission",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/confidence-achievement",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/training",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/team",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/student-creation",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/testimonial",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/industry",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.post(
//   "/faq",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );

// r.put(
//   "/footer",
//   validatorMiddleware({ body: validator.create }),
//   controller.create
// );


const landingpageRouter = r;
export default landingpageRouter;
