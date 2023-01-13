import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import login from "./routes/loginEmployee.js";
import updateEmployee from "./routes/updateProfile.js";
import {authenticateToken} from "../libraries.js";
import getTask from "./routes/getTask.js";
import getEmployee from "./routes/getEmployee.js";


const employee = express().use(cors({origin: true}));
employee.post("/employee-login", login);
employee.patch("/:userId/profile", authenticateToken, updateEmployee);
employee.get("/task", authenticateToken, getTask);
employee.get("/get-employee", authenticateToken, getEmployee);


export default
functions.region("europe-west3").https.onRequest(employee);
