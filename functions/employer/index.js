import functions from "firebase-functions";
import cors from "cors";
import express from "express";
import {db} from "../index.js";

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

export default
functions.region("europe-west3").https.onRequest(employer);
// export default employerExport;
