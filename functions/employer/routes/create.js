import {validationResult} from "express-validator";
import {db} from "../../index.js";
import * as bcrypt from "bcrypt";
import {checkIfUserExists, getUserId} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";

const createEmployer = async (req, res)=>{
  const {firstName, lastName, email, password, phoneNumber} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  if (!firstName && !lastName && !email && !password && !phoneNumber) {
    res.status(422)
        .send(
            {error:
              `Missing firstName 
              or lastName or email or password or phoneNumber`,
            },
        );
  }
  if (password.length<6) {
    res.status(400)
        .send({message: "Password must be more than 6 characters"});
  }


  try {
    const hashedPass = await bcrypt.hash(password, 10);
    console.log(hashedPass);

    const userId = await getUserId(phoneNumber);
    const defaultProfileImage = "https://example.com/default-profile-image.jpg";
    const employerData = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      permissionLevel: "admin",
      password: hashedPass,
      profile_image: defaultProfileImage,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const checkUser = await checkIfUserExists(userId);

    if (checkUser) {
      res.status(400).send({message: "User exists"});
    } else {
      await db.collection("employer-data")
          .doc(userId).set(employerData);
      res.status(200).send({data: employerData});
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default createEmployer;
