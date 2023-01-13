import {validationResult} from "express-validator";
import {getEmployeeDetails} from "../../libraries.js";

const getEmployee = async (req, res) =>{
  const {userId} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent, check errors for more information",
      errors,
    });
  }
  try {
    const user = await getEmployeeDetails(userId);
    if (!user) {
      res.status(400)
          .send({
            status: 400,
            success: false,
            error: "User not found",
          });
    } else {
      const data ={
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      };
      res.status(200)
          .send({
            status: 200,
            success: true,
            data: data,
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
export default getEmployee;
