import {validationResult} from "express-validator";
import * as bcrypt from "bcrypt";
import {accessToken,
  checkIfEmployeeExists,
  getUserId, getEmployeeDetails} from "../../libraries.js";


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
    if (checker !== true) {
      res.status(404).send({message: "User does not exist"});
    }
    const employeeDetails = await getEmployeeDetails(userId);
    if (employeeDetails === null ||
      employeeDetails === undefined ||
      employeeDetails === " "
    ) {
      res.status(404).send({message: "Cannot find user"});
    }
    if ( await bcrypt.compare(password, employeeDetails.password)) {
      const token = accessToken(employeeDetails);
      res.status(201).send({status: 201, token: token});
    } else {
      res.status(401).send({message: "Wrong credentials"});
    }
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

export default login;
