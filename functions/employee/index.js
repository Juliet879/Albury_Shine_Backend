import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import createEmployee from "./routes/createEmployee.js";
import login from "./routes/loginEmployee.js";

const employee = express().use(cors({origin: true}));
employee.post("/employee-create", createEmployee);
employee.post("/employee-login", login);


export default
functions.region("europe-west3").https.onRequest(employee);