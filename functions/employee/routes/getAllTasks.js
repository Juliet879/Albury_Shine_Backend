import {getAllTasks} from "../../libraries.js";
const allTasks = async (req, res)=>{
  try {
    const tasks = await getAllTasks();
    const taskData = tasks.map((item)=>{
      return {
        taskId: item.id,
        assigneeId: item.assigneeId,
        description: item.description,
        location: item.location,
        priority: item.priority,
        startTime: item.startTime,
        endTime: item.endTime,
        completed: item.completed || false,
      };
    });
    const userTask = taskData.filter((item)=>item.assigneeId === req.user.id);


    res.status(200).send({
      success: true,
      status: 200,
      data: userTask,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default allTasks;
