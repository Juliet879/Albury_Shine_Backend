import {getTaskProgress} from "../../libraries.js";
import {getTaskDetails} from "../../libraries.js";

const timeSheet = async (req, res)=>{
  try {
    const tasks = await getTaskProgress();
    const task =[];
    tasks.map( (item) => {
      item.data.map((details)=> {
        details.taskId= item.taskId;
        task.push(details);
      });
    });

    const data = await Promise.all(task.map(async (item)=>{
      const id= await getTaskDetails(item.taskId);
      if (item.taskId === id.id) {
        item.taskDesc = id.description;
      }
      return item;
    }));


    res.status(200)
        .send({
          status: 200,
          success: true,
          message: data,
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
