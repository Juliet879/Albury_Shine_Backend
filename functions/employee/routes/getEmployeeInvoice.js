import {getEmployeeInvoices} from "../../libraries.js";
const employeeInvoices = async (req, res)=>{
  const query = req.params.userId;
  const userId = req.user.id;

  if (userId !== query) {
    res.status(400).send({
      status: 400,
      success: false,
      message: "UserId does not match",
    });
  }
  try {
    const invoices = await getEmployeeInvoices(query);
    res.status(200).send({
      success: true,
      status: 200,
      data: invoices,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default employeeInvoices;
