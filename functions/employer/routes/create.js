import {validationResult} from "express-validator";
import {db} from "../../index.js";
import * as bcrypt from "bcrypt";
import {checkIfUserExists} from "../../libraries.js";

const createEmployer = async (req, res)=>{
  const {firstName, lastName, email, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  if (!firstName && !lastName && !email && !password) {
    res.status(422)
        .send({error: "Missing firstName or lastName or email or password"});
  }

  if (password.length<6) {
    res.status(400)
        .send({message: "Password must be more than 6 characters"});
  }


  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const userId = await db.collection("employer-data").doc().id;
    const employerData = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      permissionLevel: "admin",
      password: hashedPass,
    };
    const checkUser = await checkIfUserExists(email);

    if (checkUser === true) {
      res.status(400).send({message: "User exists"});
    } else {
      await db.collection("employer-data")
          .doc().set(employerData);
      res.status(200).send({data: employerData});
    }
  } catch (error) {
    res.status(500).send({message: error.message});
  }
};
export default createEmployer;
