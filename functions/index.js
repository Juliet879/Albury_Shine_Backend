import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";
import functions from "firebase-functions";


try {
  const filterdKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
  const configurations = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": filterdKey,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url":
       process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
  };

  admin.initializeApp(
      {
        credential: admin.credential.cert(configurations),
        databaseURL: process.env.DATABASEURL,
        storageBucket: `${process.env.BUCKET_NAME}.appspot.com`,
      },
  );
} catch (error) {
  console.log("error", error);
  admin.app();
}
import employer from "./employer/index.js";
import employee from "./employee/index.js";
import loginUser from "./login/index.js";
import {getFirestore} from "firebase-admin/firestore";


export const db= getFirestore();
export const bucket = admin.storage().bucket();


export const employers=
functions.region("europe-west3").https.onRequest(employer);

export const employees =
functions.region("europe-west3").https.onRequest(employee);

export const auth =
functions.region("europe-west3").https.onRequest(loginUser);


