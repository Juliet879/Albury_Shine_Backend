import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import login from "./routes/loginEmployee.js";
import updateEmployee from "./routes/updateProfile.js";
import {authenticateToken} from "../libraries.js";

const employee = express().use(cors({origin: true}));
employee.post("/employee-login", login);
employee.patch("/:userId/profile", authenticateToken, updateEmployee);


export default
functions.region("europe-west3").https.onRequest(employee);
