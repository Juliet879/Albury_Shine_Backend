import {db} from "../../index.js";
import {validationResult} from "express-validator";
import {getEmployeeDetails} from "../../libraries.js";
import {Timestamp} from "firebase-admin/firestore";

const addTask = async (req, res) => {
  const {location, description, startTime, endTime, priority, assignee} =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    let employee;
    if (Array.isArray(assignee)) {
      employee = assignee.map(async (item)=> await getEmployeeDetails(item));
    } else {
      employee = await getEmployeeDetails(assignee);
    }
    const data = {
      location: location,
      description: description,
      startTime: startTime,
      endTime: endTime,
      priority: priority,
      assigneeId: employee.id,
      createdAt: Timestamp.now(),

    };
    await db.collection("tasks").doc(employee.id)
        .set(data);
    res.status(200).send({
      status: 200,
      success: true,
      message:
      `Task successfully created and assigned to ${employee.firstName}`,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default addTask;
