import {updateEmployerDetails, getAdminDetails} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";
import * as bcrypt from "bcrypt";


const updateAdmin = async (req, res)=>{
  const {firstName, lastName, email, phoneNumber, password} = req.body;
  const query = req.params.userId;
  const userId = req.user.id;
  const hashedPass = await bcrypt.hash(password, 10);
  if (userId !== query) {
    res.status(400).send({
      status: 400,
      success: false,
      message: "UserId does not match",
    });
  }
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const getCurrentDetails = await getAdminDetails(userId);
    if (!getCurrentDetails) {
      res.status(404).send({
        status: 404,
        success: false,
        error: "User does not exist",
      });
    } else {
      const userData = {
        email: email? email : getCurrentDetails.email,
        firstName: firstName? firstName : getCurrentDetails.firstName,
        lastName: lastName? lastName : getCurrentDetails.lastName,
        password: hashedPass? hashedPass : getCurrentDetails.password,
        phoneNumber: phoneNumber? phoneNumber :getCurrentDetails.phoneNumber,
        updatedAt: Timestamp.now(),
      };
      await updateEmployerDetails(userData, userId);
      res.status(200)
          .send({
            status: 200,
            success: true,
            message: "Details updated successfully",
          });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export default updateAdmin;
