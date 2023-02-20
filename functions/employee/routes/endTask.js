import {validationResult} from "express-validator";
import {db} from "../../index.js";

const endTask = async (req, res)=>{
  const {endTime, location, taskId, assigneeId} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent, check errors for more information",
      errors,
    });
  }
  try {
    // get the current existing task
    const getTask = await db.collection("task-progress")
        .doc(taskId).get();
    if (!getTask.exists) {
      res.status(404)
          .send({
            status: 404,
            success: false,
            error: "Task id does not exist",
          });
    }
    const getAssigneeProgress = getTask.data().data
        .filter((item)=>item.assigneeId === assigneeId);
    console.log(getAssigneeProgress);


    const checkUser = getTask.data().data;
    const data = checkUser.map((item)=>{
      if (item.assigneeId === assigneeId) {
        item.location = location;
        item.status="Completed";
        item.endTime= endTime;
      }
      return item;
    });

    await db.collection("task-progress")
        .doc(taskId)
        .update({
          data: data,
        });


    await db.collection("tasks").doc(taskId)
        .update({
          status: "Completed",
        });
    res.status(200).send({
      status: 200,
      success: true,
      message: "Task ended and updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default endTask;
