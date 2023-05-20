import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import updateEmployee from "./routes/updateProfile.js";
import {authenticateToken} from "../libraries.js";
import getTask from "./routes/getTask.js";
import getEmployee from "./routes/getEmployee.js";
import allTasks from "./routes/getAllTasks.js";
import startTask from "./routes/startTask.js";
import endTask from "./routes/endTask.js";
import employeeInvoices from "./routes/getEmployeeInvoice.js";


const employee = express().use(cors({origin: true}));
employee.patch("/profile/:userId", authenticateToken, updateEmployee);
employee.get("/task", authenticateToken, getTask);
employee.get("/all-tasks", authenticateToken, allTasks);
employee.get("/get-employee/:userId", authenticateToken, getEmployee);
employee.post("/start-task", authenticateToken, startTask);
employee.post("/end-task", authenticateToken, endTask);
employee.get("/employee-invoices/:userId", authenticateToken, employeeInvoices);


export default
functions.region("europe-west3").https.onRequest(employee);
