import cors from "cors";
import functions from "firebase-functions";
import express from "express";
import login from "./login.js";
const loginUser = express().use(cors({origin: true}));

loginUser.post("/login", login);
export default
functions.region("europe-west3").https.onRequest(loginUser);
