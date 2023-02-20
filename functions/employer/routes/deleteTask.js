import {validationResult} from "express-validator";
import {taskDelete} from "../../libraries.js";
const deleteTask = async (req, res)=>{
  const {taskId} = req.body;
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
    const deleteDetails = await taskDelete(taskId);
    if (deleteDetails) {
      res.status(200)
          .send({
            status: 200,
            success: true,
            message: "Task deleted successfully",
          });
    } else {
      res.status(404)
          .send({
            status: 404,
            success: false,
            message: "Task does not exist",
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
export default deleteTask;
