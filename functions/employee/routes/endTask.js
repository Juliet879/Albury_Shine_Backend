import {validationResult} from "express-validator";
import {db} from "../../index.js";
import {FieldValue} from "firebase-admin/firestore";


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
    const data = {
      startTime: getAssigneeProgress[0].startTime,
      location: location,
      assigneeId: assigneeId,
      status: "Completed",
      endTime: endTime,
    };


    // const checkUser = getTask.data().data;
    // const check = checkUser.filter((item)=>item. === assigneeId);
    // if (check.length !== 0) {
    //   res.status(409)
    //       .send({
    //         status: 409,
    //         success: false,
    //         error: "User cannot end the same task twice",
    //       });
    // }
    await db.collection("task-progress")
        .doc(taskId)
        .update({
          data: FieldValue.arrayUnion(data),
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
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default endTask;
