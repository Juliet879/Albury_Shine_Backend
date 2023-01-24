import {validationResult} from "express-validator";
import {db} from "../../index.js";
import {FieldValue} from "firebase-admin/firestore";


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
      assigneeId: assigneeId,
      status: "In Progress",
      endTime: "",
    };

    const checkTaskProgress = await db.collection("task-progress")
        .doc(taskId).get();
    if (!checkTaskProgress.exists) {
      await db.collection("task-progress")
          .doc(taskId)
          .set({
            taskId: taskId,
            data: [data],
          });
    } else {
      const checkUser = checkTaskProgress.data().data;
      const check = checkUser.filter((item)=>item.assigneeId === assigneeId);
      if (check.length !== 0) {
        res.status(409)
            .send({
              status: 409,
              success: false,
              error: "User cannot start the same task twice",
            });
      }
      await db.collection("task-progress")
          .doc(taskId)
          .update({
            data: FieldValue.arrayUnion(data),
          });
    }


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
