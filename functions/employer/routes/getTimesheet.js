import {
  getTaskProgress,
  getTaskDetails,
  getEmployeeDetails,
  getHourDiff,
} from "../../libraries.js";

const timeSheet = async (req, res) => {
  try {
    const tasks = await getTaskProgress();
    const task = [];
    tasks.map((item) => {
      item.data.map((details) => {
        details.taskId = item.taskId;
        task.push(details);
      });
    });

    const data = await Promise.all(
        task.map(async (item) => {
         item.endTime?
         item.hours= getHourDiff(item.startTime, item.endTime): null;
         const id = await getTaskDetails(item.taskId);
         if (item.taskId === id.id) {
           item.taskDesc = id.description;
         }
         const employee = await getEmployeeDetails(item.assigneeId);
         if (item.assigneeId === employee.id) {
           item.assignee = `${employee.firstName} ${employee.lastName}`;
         }
         return item;
        }),
    );

    res.status(200).send({
      status: 200,
      success: true,
      message: data,
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
export default timeSheet;
