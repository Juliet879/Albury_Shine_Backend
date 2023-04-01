import {db} from "../../index.js";
import {validationResult} from "express-validator";
import {getEmployeeDetails} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";

let invoiceNumber = 1;
const generateTask = async (req, res)=>{
  const {
    phoneNumber,
    employeeName,
    address,
    email,
    userId,
    bank,
    bsb,
    accountNumber,
    abn,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    let employee;
    const invoiceId = db.collection("invoice").doc().id;
    const checkEmployee = await getEmployeeDetails(userId);
    if (!checkEmployee) {
      res.status(404).send({
        status: 404,
        success: false,
        error: `Employee with the username ${employeeName} does not exist`,
      });
    }
    const data = {
      phoneNumber,
      employeeName,
      address,
      email,
      userId,
      bank,
      bsb,
      accountNumber,
      abn,
      date: Timestamp.now(),
    };
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
