import express from "express";
import cors from "cors";
import "./conectiondb.js";
import rotaUsuario from "./app/Usuario/Router.js";
import login from "./app/Login/Router.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.port || 3007;

app.use('/usuario', rotaUsuario);
app.use("/login", login);

app.listen(port);
console.log('port ' + port)