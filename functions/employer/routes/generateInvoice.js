import {db} from "../../index.js";
import {validationResult} from "express-validator";
import {getCompletedTasks,
  generateInvoice,
  getHourDiff} from "../../libraries.js";

// import {Timestamp} from "firebase-admin/firestore";


const createInvoice = async (req, res)=>{
  const {address,
    userId,
    bank,
    bsb,
    accountNumber,
    abn,
  } = req.body;
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


    const userLastInvoiceDates = new Map();

    if (userLastInvoiceDates.has(userId)) {
      const lastInvoiceDate = userLastInvoiceDates.get(userId);
      const twoWeeksLater = new Date(lastInvoiceDate);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      if (new Date() < twoWeeksLater) {
        return res.status(400)
            .send(

                {status: 400,
                  success: false,
                  // eslint-disable-next-line max-len
                  error: "Invoice cannot be generated until the next two weeks have lapsed."},
            );
      }
    }

    const tasks = await getCompletedTasks(userId);
    if (tasks.length === 0) {
      return res.status(400).send(
          {status: 400,
            success: false,
            error: "No tasks completed in the last two weeks."});
    }
    const taskDetails = tasks.map((item)=>{
      const hours= getHourDiff(item.startTime, item.endTime);
      const rate = item.rate?item.rate:20;
      return {
        "quantity": 1,
        "description": item.description,
        "tax-rate": 2,
        "price": hours*rate,
      };
    });
    const details={
      address: address,
      abn,
      accountNumber,
      bank,
      bsb,
    };
    const response = await generateInvoice(userId, taskDetails, details);
    userLastInvoiceDates.set(userId, new Date());

    const invoiceId = db.collection("invoice").doc().id;
    await db.collection("invoice")
        .doc(invoiceId).set({
          employeeId: userId,
          invoiceId: invoiceId,
          data: response.pdf,
        });
    res.status(200).send({
      status: 200,
      message: "Invoice generated successfully.",
      data: response.pdf,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default createInvoice;
