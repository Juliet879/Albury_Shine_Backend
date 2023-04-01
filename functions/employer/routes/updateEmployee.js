import {getEmployeeDetails, updateEmployeeDetails} from "../../libraries.js";

const updateEmployee = async (req, res)=>{
  const {firstName, lastName, email, phoneNumber} = req.body;
  const query = req.params.userId;

  try {
    const getCurrentDetails = await getEmployeeDetails(query);
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
        password: getCurrentDetails.password,
        phoneNumber: phoneNumber? phoneNumber :getCurrentDetails.phoneNumber,
      };
      await updateEmployeeDetails(userData, query);
      res.status(200)
          .send({
            status: 200,
            success: true,
            message: "Details updated successfully",
          });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};

export default updateEmployee;
