import {updateTaskDetails, getTaskDetails} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";

const updateTask = async (req, res)=>{
  try {
    const {location, description, startTime, endTime, priority, assigneeId} =
    req.body;
    const query = req.params.taskId;
    const tasks = await getTaskDetails(query);
    if (!tasks) {
      res.status(400)
          .send({
            status: 400,
            success: false,
            error: "There is no task with that id",
          });
    } else {
      const taskDetails = {
        location: location? location : tasks.location,
        description: description ? description : tasks.description,
        startTime: startTime? startTime : tasks.startTime,
        endTime: endTime? endTime : tasks.endTime,
        priority: priority ? priority : tasks.priority,
        assigneeId: assigneeId ? assigneeId : tasks.assigneeId,
        updatedAt: Timestamp.now(),
      };
      await updateTaskDetails(taskDetails, query);
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
export default updateTask;
