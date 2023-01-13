import {validationResult} from "express-validator";
import * as bcrypt from "bcrypt";
import {
  accessToken,
  checkAdminEmail,
} from "../../libraries.js";


const login = async (req, res)=>{
  const {email, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  if (!email && !password) {
    res.status(422)
        .send({error: "Missing email or password"});
  }
  const adminDetails = await checkAdminEmail(email);
  if (!adminDetails) {
    res.status(404).send({message: "User does not exist"});
  }
  try {
    if ( await bcrypt.compare(password, adminDetails.password)) {
      const token = accessToken(adminDetails);
      res.status(201).send({status: 201, token: token});
    } else {
      res.status(401).send({message: "Wrong credentials"});
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
