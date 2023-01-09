import {validationResult} from "express-validator";
import {employeeDelete} from "../../libraries.js";
const deleteEmployee = async (req, res)=>{
  const {employeeId} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  } try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const deleteDetails = await employeeDelete(employeeId);
    if (deleteDetails) {
      res.status(200)
          .send({
            status: 200,
            success: true,
            message: "Employee deleted successfully",
          });
    } else {
      res.status(404)
          .send({
            status: 404,
            success: false,
            message: "User does not exist",
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
export default deleteEmployee;
