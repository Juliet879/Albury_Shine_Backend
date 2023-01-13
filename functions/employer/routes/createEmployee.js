import {validationResult} from "express-validator";
import {db} from "../../index.js";
import * as bcrypt from "bcrypt";
import {checkIfEmployeeExists,
  getUserId,
  sendCredentialsEmail} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";

const createEmployee = async (req, res)=>{
  const {firstName, lastName, email, phoneNumber} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }

  // if (password.length<6) {
  //   res.status(400)
  //       .send({message: "Password must be more than 6 characters"});
  // }


  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    if (!firstName && !lastName && !email && !phoneNumber) {
      res.status(422)
          .send({error:
            "Missing firstName or lastName or email or password or phoneNumber",
          });
    }
    const hashedPass = await bcrypt.hash(`${firstName}${lastName}`, 10);

    const userId = await getUserId(phoneNumber);
    const employeeData = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      permissionLevel: "employee",
      password: hashedPass,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const checkUser = await checkIfEmployeeExists(phoneNumber);

    if (checkUser === true) {
      res.status(400).send({message: "User exists"});
    } else {
      sendCredentialsEmail(email,
          `Welcome to Albury ${firstName}!!`,
          phoneNumber, `${firstName}${lastName}`);
      await db.collection("employee-data")
          .doc(userId).set(employeeData);

      res.status(200).send({data: employeeData});
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default createEmployee;
