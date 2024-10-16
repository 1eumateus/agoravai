import express from "express";
import cors from "cors";
import "./conectiondb.js";
import path from "path";
import usuario from "./app/Usuario/Router.js";
import orientacao from "./app/Orientacao/Router.js";
import login from "./app/Login/Router.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.port || 3007;
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/usuario', usuario);
app.use("/orientacao", orientacao);
app.use("/login", login);

app.listen(port);
console.log('port ' + port)