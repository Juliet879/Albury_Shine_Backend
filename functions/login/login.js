import {validationResult} from "express-validator";
import * as bcrypt from "bcrypt";
import {accessToken,
  checkIfEmployeeExists,
  getAdminDetails,
  checkIfUserExists,
  getUserId, getEmployeeDetails} from "../libraries.js";


const login = async (req, res)=>{
  const {phoneNumber, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  if (!phoneNumber && !password) {
    res.status(422)
        .send({error: "Missing email or password"});
  }


  try {
    if (phoneNumber[0] === "0") {
      res.status(400)
          .send(
              {message:
                 "All phonenumbers must begin with a country code ie:254"});
    }
    const userId = await getUserId(phoneNumber);
    const checker = await checkIfEmployeeExists(userId);
    const checkAdmin = await checkIfUserExists(userId);

    if (checker !== true && checkAdmin) {
      console.log({checker});
      const employerDetails = await getAdminDetails(userId);
      if (employerDetails === null ||
        employerDetails === undefined ||
        employerDetails === " "
      ) {
        res.status(404).send({message: "Cannot find user"});
      }
      if ( await bcrypt.compare(password, employerDetails.password)) {
        const token = accessToken(employerDetails);
        res.status(201).send(
            {status: 201,
              token: token,
              permissionLevel: "admin",
              userId: employerDetails.id,
              firstName: employerDetails.firstName,
              lastName: employerDetails.lastName,

            });
      } else {
        res.status(401).send({message: "Wrong credentials"});
      }
    } else if (checker && checkAdmin !== true) {
      const employeeDetails = await getEmployeeDetails(userId);
      if (employeeDetails === null ||
      employeeDetails === undefined ||
      employeeDetails === " "
      ) {
        res.status(404).send({message: "Cannot find user"});
      }
      if ( await bcrypt.compare(password, employeeDetails.password)) {
        const token = accessToken(employeeDetails);
        res.status(201).send(
            {status: 201,
              token: token,
              permissionLevel: "employee",
              userId: employeeDetails.id,
              firstName: employeeDetails.firstName,
              lastName: employeeDetails.lastName,
            });
      } else {
        res.status(401).send({message: "Wrong credentials"});
      }
    } else {
      res.status(400).send({error: "User does not exist"});
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export default login;
