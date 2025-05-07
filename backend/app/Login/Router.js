import express from "express";
import { login, getUser, confirmarEmail} from "./Controller.js";

const router = express.Router ();

router.get ("/getUser", getUser);
router.get ("/confirmarEmail", confirmarEmail);
router.post ("/", login);

export default router;
