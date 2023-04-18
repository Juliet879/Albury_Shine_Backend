import {getEmployeeDetails, updateEmployeeDetails} from "../../libraries.js";
import * as bcrypt from "bcrypt";

const updateEmployee = async (req, res)=>{
  const {password} = req.body;
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
    const getCurrentDetails = await getEmployeeDetails(userId);
    if (!getCurrentDetails) {
      res.status(404).send({
        status: 404,
        success: false,
        error: "User does not exist",
      });
    } else {
      const userData = {
        email: getCurrentDetails.email,
        firstName: getCurrentDetails.firstName,
        lastName: getCurrentDetails.lastName,
        password: hashedPass? hashedPass : getCurrentDetails.password,
        phoneNumber: getCurrentDetails.phoneNumber,
      };
      await updateEmployeeDetails(userData, userId);
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

export default updateEmployee;
