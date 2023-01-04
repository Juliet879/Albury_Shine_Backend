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
  try {
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
  } catch (error) {
    return error.message;
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
  return querySnapshot;
};
export const getUserId = (senderMSISDN) => {
  if (senderMSISDN[0]=== "0") {
    return "All phonenumbers must begin with a country code ie:254 ";
  } else {
    return new Promise((resolve) => {
      const senderId = crypto
          .createHash("sha1")
          .update(senderMSISDN)
          .digest("hex");
      resolve(senderId);
    });
  }
};

export const accessToken = (user)=>{
  const SECRET_KEY = SECRET;
  return jwt.sign(user, SECRET_KEY, {expiresIn: "3000s"});
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  const SECRET_KEY = SECRET;

  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403);
    let uid;
    if (user.phoneNumber) {
      const phoneNumber = user.phoneNumber.substring(1);
      uid = await getUserId(phoneNumber);
    } else {
      uid = user.id;
    }

    user.userId = uid;
    req.user = user;
    next();
  });
};
export const getAllEmployees= async ()=>{
  const checkUsers = await
  db.collection("employee-data")
      .get();
  const querySnapshot = [];
  console.log(checkUsers);
  if (checkUsers.empty) {
    return "Unable to fetch employees from the database";
  } else {
    checkUsers.forEach((item)=>{
      querySnapshot.push(item.data());
    });
  }
  return querySnapshot;
};
