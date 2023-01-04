import {getAllEmployees} from "../../libraries.js";
const allEmployees = async (req, res)=>{
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const employees = await getAllEmployees();
    const employeeData = employees.map((item)=>{
      return {id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        phoneNumber: item.phoneNumber,
        email: item.email};
    });

    res.status(200).send({
      success: true,
      status: 200,
      data: employeeData,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default allEmployees;
