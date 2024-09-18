import express from "express";
import { login, getUser, confirmarEmail } from "./Controller.js";

const router = express.Router();

router.post("/", login);
router.get("/getUser", getUser);
router.get("/confirmarEmail", confirmarEmail);

export default router;
