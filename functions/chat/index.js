import cors from "cors";
import functions from "firebase-functions";
import express from "express";
import getTokens from "./generateToken";

const tokens =express().use(cors({origin: true}));
tokens.post("/tokens", getTokens);
export default
functions.region("europe-west3").https.onRequest(tokens);
