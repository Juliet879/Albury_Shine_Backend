import {getEmployeeInvoices, getEmployeeDetails} from "../../libraries.js";
const employeeInvoicesById = async (req, res)=>{
  const userId = req.params.userId;

  try {
    const getCurrentDetails = await getEmployeeDetails(userId);
    if (!getCurrentDetails) {
      res.status(404).send({
        status: 404,
        success: false,
        error: "User does not exist",
      });
    }
    const invoices = await getEmployeeInvoices(userId);

    res.status(200).send({
      success: true,
      status: 200,
      data: invoices === false? [] : invoices,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default employeeInvoicesById;
