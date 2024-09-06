import express from "express";
import { login, getUser } from "./Controller.js";

const router = express.Router();

router.post("/", login);
router.get("/getUser", getUser);

export default router;
