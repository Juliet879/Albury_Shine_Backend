import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import {db} from "../index.js";
import createEmployer from "./routes/create.js";
import allEmployees from "./routes/getAllemployees.js";
import {authenticateToken} from "../libraries.js";
import addTask from "./routes/createTask.js";
import createEmployee from "./routes/createEmployee.js";
import deleteEmployee from "./routes/deleteEmployee.js";
import updateAdmin from "./routes/updateProfile.js";
import updateTask from "./routes/updateTask.js";
import getTask from "./routes/getTask.js";
import getEmployee from "./routes/getEmployee.js";
import allTasks from "./routes/getAllTasks.js";
import getEmployer from "./routes/getAdminDetails.js";
import deleteTask from "./routes/deleteTask.js";
import timeSheet from "./routes/getTimesheet.js";
import updateEmployee from "./routes/updateEmployee.js";
import createInvoice from "./routes/generateInvoice.js";

const employer = express().use(cors({origin: true}));
employer.post("/", async (req, res) => {
  try {
    const id= await db.collection("checker").id;
    const save =await db.collection("checker")
        .doc(id).set({details: "working great"});
    console.log(save);
    res.status(200).send({message: "Hello"});
  } catch (error) {
    res.status(500).send({message: error.message});
  }
});

employer.post("/createEmployer", createEmployer);
employer.get("/all-employees", authenticateToken, allEmployees);
employer.post("/add-task", authenticateToken, addTask);
employer.post("/create-employee", authenticateToken, createEmployee);
employer.delete("/delete-employee", authenticateToken, deleteEmployee);
employer.patch("/profile/:userId", authenticateToken, updateAdmin);
employer.patch("/update//:taskId", authenticateToken, updateTask);
employer.get("/task", authenticateToken, getTask);
employer.get("/all-tasks", authenticateToken, allTasks);
employer.get("/get-employee/:userId", authenticateToken, getEmployee);
employer.get("/get-admin/:userId", authenticateToken, getEmployer);
employer.delete("/delete-task", authenticateToken, deleteTask);
employer.get("/timesheet", authenticateToken, timeSheet);
employer.patch("/update-employee/:userId", authenticateToken, updateEmployee);
employer.post("/generate-invoice", authenticateToken, createInvoice);

export default
functions.region("europe-west3").https.onRequest(employer);

