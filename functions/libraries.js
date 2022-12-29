import dotenv from "dotenv";
dotenv.config();
import {db} from "./index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET = process.env.JWT_KEY_KEY;

export const checkIfUserExists = async (email)=>{
  const checkEmail = await
  db.collection("employer-data").where("email", "==", email)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return null;
  } else {
    checkEmail.forEach((item)=>{
      querySnapshot= item.data();
    });
  }
  if (querySnapshot!== undefined) {
    return true;
  } else {
    return false;
  }
};

export const getAdminDetails= async (email)=>{
  const checkEmail = await
  db.collection("employer-data").where("email", "==", email)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return "Unable to fetch admin details from the database";
  } else {
    checkEmail.forEach((item)=>{
      querySnapshot= item.data();
    });
  }
  if (querySnapshot!== undefined) {
    return querySnapshot;
  } else {
    return false;
  }
};
export const checkIfEmployeeExists = async (userId)=>{
  const checkId = await
  db.collection("employee-data").where("id", "==", userId)
      .get();
  let querySnapshot;
  if (checkId.empty) {
    return null;
  } else {
    checkId.forEach((item)=>{
      querySnapshot= item.data();
    });
  }
  if (querySnapshot!== undefined) {
    return true;
  } else {
    return false;
  }
};

export const getEmployeeDetails= async (userId)=>{
  const checkUser = await
  db.collection("employee-data").where("id", "==", userId)
      .get();
  let querySnapshot;
  if (checkUser.empty) {
    return "Unable to fetch employee details from the database";
  } else {
    checkUser.forEach((item)=>{
      querySnapshot= item.data();
    });
  }
  if (querySnapshot!== undefined) {
    return querySnapshot;
  } else {
    return false;
  }
};
export const getUserId = (senderMSISDN) => {
  return new Promise((resolve) => {
    const senderId = crypto
        .createHash("sha1")
        .update(senderMSISDN)
        .digest("hex");
    resolve(senderId);
  });
};


export const accessToken = (user)=>{
  const SECRET_KEY = SECRET;
  return jwt.sign(user, SECRET_KEY, {expiresIn: "3000s"});
};
