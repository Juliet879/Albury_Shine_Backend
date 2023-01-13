import {validationResult} from "express-validator";
import {getTaskDetails} from "../../libraries.js";

const getTask = async (req, res) =>{
  const {taskId} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent, check errors for more information",
      errors,
    });
  }
  try {
    const task = await getTaskDetails(taskId);
    if (!task) {
      res.status(400)
          .send({
            status: 400,
            success: false,
            error: "Task not found",
          });
    } else {
      const data ={
        assigneeId: task.assigneeId,
        description: task.description,
        taskId: taskId,
        location: task.location,
        priority: task.priority,
        startTime: task.startTime,
        endTime: task.endTime,
        completed: task.completed,
      };
      console.log(data);
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
export default getTask;
