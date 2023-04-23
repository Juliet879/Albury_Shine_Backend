import {getAllTasks} from "../../libraries.js";
const allTasks = async (req, res)=>{
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const tasks = await getAllTasks();

    res.status(200).send({
      success: true,
      status: 200,
      data: tasks,
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
