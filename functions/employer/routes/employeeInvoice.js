import {getAllInvoices} from "../../libraries.js";
const allInvoices = async (req, res)=>{
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const invoices = await getAllInvoices();

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
export default allInvoices;
