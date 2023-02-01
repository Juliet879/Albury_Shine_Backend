import {getTaskProgress} from "../../libraries.js";
import {getTaskDetails} from "../../libraries.js";

const timeSheet = async (req, res)=>{
  try {
    const tasks = await getTaskProgress();
    console.log(tasks);

    const taskId = tasks.map( (item) => item.taskId);

    console.log(taskId);
    const taskDetails = [];
    for (let i =0; i< taskId.length; i++) {
      taskDetails.push(await getTaskDetails(taskId[i]));
    }
    console.log(taskDetails);

    // const taskData = tasks.map((item)=>{
    // //   taskDetails.map((item) => {
    // //     if (item.id === item.taskId) {

    // //     }
    //   });
    //   item.data;
    // });
    // console.log(taskData);

    res.status(200)
        .send({
          status: 200,
          success: true,
          message: tasks,
        });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default timeSheet;
