import {validationResult} from "express-validator";
import {db} from "../../index.js";


const startTask = async (req, res)=>{
  const {startTime, location, taskId, assigneeId} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent, check errors for more information",
      errors,
    });
  }
  try {
    const data = {
      startTime: startTime,
      location: location,
      taskId: taskId,
      assigneeId: [assigneeId],
      status: "In Progress",
      endTime: "",
    };
    await db.collection("task-progress")
        .doc(taskId)
        .set(data);
    await db.collection("tasks").doc(taskId)
        .update({
          status: "In progress",
        });
    res.status(200).send({
      status: 200,
      success: true,
      message: "Task started and updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default startTask;
