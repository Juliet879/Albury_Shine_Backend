import dotenv from "dotenv";
dotenv.config();
import {db} from "./index.js";
import jwt from "jsonwebtoken";

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

export const accessToken = (user)=>{
  const SECRET_KEY = SECRET;
  return jwt.sign(user, SECRET_KEY, {expiresIn: "3000s"});
};
