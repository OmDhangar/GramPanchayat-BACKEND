import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  submitBirthCertificateApplication,
  submitDeathCertificateApplication,
  submitMarriageCertificateApplication,
  getUserApplications,
  getApplicationDetails
} from "../controllers/application.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure all routes with JWT verification
router.use(verifyJWT);

// Application submission routes
router.route("/birth-certificate").post(
  upload.array("documents", 5), // Allow up to 5 document uploads
  submitBirthCertificateApplication
);

router.route("/death-certificate").post(
  upload.array("documents", 5),
  submitDeathCertificateApplication
);

router.route("/marriage-certificate").post(
  upload.array("documents", 5),
  submitMarriageCertificateApplication
);

// Application retrieval routes

router.route("/user").get(verifyJWT , getUserApplications);
router.route("/:applicationId").get( verifyJWT , getApplicationDetails);

export default router;