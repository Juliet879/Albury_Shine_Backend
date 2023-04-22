/* eslint-disable require-jsdoc */
import dotenv from "dotenv";
dotenv.config();
import {db} from "./index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import easyinvoice from "easyinvoice";


const SECRET = process.env.JWT_KEY_KEY;

export const checkIfUserExists = async (userId) => {
  const checkEmail = await db
      .collection("employer-data")
      .where("id", "==", userId)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return false;
  } else {
    checkEmail.forEach((item) => {
      querySnapshot = item.data();
    });
  }
  return querySnapshot;
};

export const checkAdminEmail = async (email) => {
  const checkEmail = await db
      .collection("employer-data")
      .where("email", "==", email)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return false;
  } else {
    checkEmail.forEach((item) => {
      querySnapshot = item.data();
    });
  }
  return querySnapshot;
};

export const getAdminDetails = async (userId) => {
  const checkEmail = await db
      .collection("employer-data")
      .where("id", "==", userId)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return false;
  } else {
    checkEmail.forEach((item) => {
      querySnapshot = item.data();
    });
  }
  return querySnapshot;
};
export const checkIfEmployeeExists = async (userId) => {
  try {
    const checkId = await db
        .collection("employee-data")
        .where("id", "==", userId)
        .get();
    let querySnapshot;
    if (checkId.empty) {
      return null;
    } else {
      checkId.forEach((item) => {
        querySnapshot = item.data();
      });
    }
    if (querySnapshot !== undefined) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error.message;
  }
};

export const getEmployeeDetails = async (userId) => {
  const checkUser = await db
      .collection("employee-data")
      .where("id", "==", userId)
      .get();
  let querySnapshot;
  if (checkUser.empty) {
    return false;
  } else {
    checkUser.forEach((item) => {
      querySnapshot = item.data();
    });
  }
  return querySnapshot;
};
export const getUserId = (senderMSISDN) => {
  if (senderMSISDN[0] === "0") {
    return "All phonenumbers must begin with a country code ie:254 ";
  } else {
    return new Promise((resolve) => {
      const senderId = crypto
          .createHash("sha1")
          .update(senderMSISDN)
          .digest("hex");
      resolve(senderId);
    });
  }
};

export const accessToken = (user) => {
  const SECRET_KEY = SECRET;
  return jwt.sign(user, SECRET_KEY, {expiresIn: "3000s"});
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  const SECRET_KEY = SECRET;

  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403);
    let uid;
    if (user.phoneNumber) {
      const phoneNumber = user.phoneNumber.substring(1);
      uid = await getUserId(phoneNumber);
    } else {
      uid = user.id;
    }

    user.userId = uid;
    req.user = user;
    next();
  });
};
export const getAllEmployees = async () => {
  const checkUsers = await db.collection("employee-data").get();
  const querySnapshot = [];
  console.log(checkUsers);
  if (checkUsers.empty) {
    return false;
  } else {
    checkUsers.forEach((item) => {
      querySnapshot.push(item.data());
    });
  }
  return querySnapshot;
};

export const sendCredentialsEmail =
 (receiver, subject, phoneNumber, password) => {
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: "alburyshine@gmail.com",
       pass: "rowxrtlcroxlxmjt",
     },
   });

   const mailOptions = {
     from: "alburyshine@gmail.com",
     to: receiver,
     subject: subject,
     html: `<h3>Welcome to AlburyShine!!
    </h3><p>Please use the below credentials to login to the application.</p>
     <p><bold>Phonenumber: ${phoneNumber}</bold></p>
     <p><bold>Password: ${password}</bold></p>
     <bold>NB: Ensure you change your password for your security</bold>`,
   };

   transporter.sendMail(mailOptions, function(error, info) {
     if (error) {
       return error;
     } else {
       return "Email sent successfully";
     }
   });
 };
export const sendTaskEmail =
(receiver, subject, data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alburyshine@gmail.com",
      pass: "rowxrtlcroxlxmjt",
    },
  });

  const mailOptions = {
    from: "alburyshine@gmail.com",
    to: receiver,
    subject: subject,
    html: `
    <p>Please find the below details on your assigned task.</p>
    <p>Task Details:</p>
    <p>Location: <b>${data.location}</b></p>
    <p>Description: <b>${data.description}</b></p>
    <p>Start Time: <b>${data.startTime}</b></p>
    <p>End Time: <b>${data.endTime}</b></p>
    <p>Priority: <b>${data.priority}</b></p>
    <p>Regards,</p>
    <p>Albury Shine Team</p>`,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return error;
    } else {
      return "Email sent successfully";
    }
  });
};

export const employeeDelete = async (employeeId)=>{
  const checkIfEmployeeExists = await getEmployeeDetails(employeeId);
  if (!checkIfEmployeeExists) {
    return false;
  }
  await db.collection("employee-data")
      .doc(employeeId)
      .delete();
  return true;
};
export const updateEmployeeDetails = async (data, userId) =>{
  await db.collection("employee-data").doc(userId)
      .update(data);

  return true;
};

export const updateEmployerDetails = async (data, userId) =>{
  await db.collection("employer-data").doc(userId)
      .update(data);
  return true;
};

export const getAllTasks = async () => {
  const checkTasks = await db.collection("tasks").get();
  const querySnapshot = [];
  if (checkTasks.empty) {
    return false;
  } else {
    checkTasks.forEach((item) => {
      querySnapshot.push(item.data());
    });
  }
  return querySnapshot;
};

export const updateTaskDetails = async (data, taskId) =>{
  await db.collection("tasks").doc(taskId)
      .update(data);
  return true;
};

export const getTaskDetails = async (taskId) => {
  const checkTask = await db
      .collection("tasks")
      .where("id", "==", taskId)
      .get();
  let querySnapshot;
  if (checkTask.empty) {
    return false;
  } else {
    checkTask.forEach((item) => {
      querySnapshot = item.data();
    });
  }
  return querySnapshot;
};

export const taskDelete = async (taskId)=>{
  const checkIfTaskExists = await getTaskDetails(taskId);
  if (!checkIfTaskExists) {
    return false;
  }
  await db.collection("tasks")
      .doc(taskId)
      .delete();
  return true;
};

export const getTaskProgress =async ()=>{
  const checkTasks = await db.collection("task-progress").get();
  const querySnapshot = [];
  if (checkTasks.empty) {
    return false;
  } else {
    checkTasks.forEach((item) => {
      querySnapshot.push(item.data());
    });
  }
  return querySnapshot;
};

export const getHourDiff =(time1, time2)=>{
  const dt1 = new Date(time1);
  console.log({dt1});
  const dt2 = new Date(time2);
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60*60);
  return Math.abs(Math.round(diff));
};

export const sendInvoiceEmail =
async (receiver, subject, result) => {
  // const elementId = "pdf";
  // const invoice = await easyinvoice.render(elementId, result.pdf);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alburyshine@gmail.com",
      pass: "rowxrtlcroxlxmjt",
    },
  });

  const mailOptions = {
    from: "alburyshine@gmail.com",
    to: receiver,
    subject: subject,
    html: `
    <p>Please find the below details on your invoice for the last two weeks.</p>
<div>${result.pdf}</div>
    <p>Regards,</p>
    <p>Albury Shine Team</p>`,
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return error;
    } else {
      return "Email sent successfully";
    }
  });
};
export const getCompletedTasks = async (userId) =>{
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate()-14);
  try {
    const taskSnapShot = await db.collection("tasks")
        .where("assigneeId", "array-contains", userId)
        // .where("endTime", ">", twoWeeksAgo)
        .get();

    const tasks = taskSnapShot.docs.map((doc)=>doc.data());
    return tasks;
  } catch (error) {
    console.log({error});
    return [];
  }
};

export const generateInvoice = async (userId, tasks, details)=>{
  const employee = await getEmployeeDetails(userId);
  let invoiceNumber = 2023.0000;
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate()+7);
  // item.hours= getHourDiff(item.startTime, item.endTime): null;
  const data = {

    "images": {
      // The logo on top of your invoice
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
      // The invoice background
      "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
    },
    // Your own data
    "sender": {
      "company": "Albury Shine",
      "address": `${details.address}`,
      // "zip": `${details.zip||""}`,
      // "city": `${details.city || ""}`,
      "country": `${details.country|| ""}`,
      "bank": `${details.bank}`,
      "bsb": `${details.bsb}`,
      "accountNumber": `${details.accountNumber}`,
      "abn": `${details.abn}`,
    },
    // Your recipient
    "client": {
      "company": "Albury Shine",
      // "address": "Clientstreet 456",
      // "zip": "4567 CD",
      // "city": "Clientcity",
      // "country": "Clientcountry",
      "Employee Name": `${employee.firstName} ${employee.lastName}`,
      "PhoneNumber": `${employee.phoneNumber}`,
      "Email": `${employee.email}`,
    },
    "information": {
      // Invoice number
      "number": `${invoiceNumber+=1}`,
      // Invoice data
      "date": `${new Date()}`,
      // Invoice due date
      "due-date": `${oneWeekLater}`,
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    "products": tasks,
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    // Settings to customize your invoice
    "settings": {
      "currency": "USD",
    },
  };

  // Create your invoice! Easy!
  const response = easyinvoice.createInvoice(data, function(result) {
    // The response will contain a base64 encoded PDF file

    // console.log(response);
    return result;
  });
  await sendInvoiceEmail(employee.email, "Albury Shine Invoice", response);
  return response;
};
// export async function uploadDefaultProfileImage(uid) {
//   const defaultImagePath = "functions/default_image.jpg";
//   const storageRef = bucket
//   const profileImageRef = storageRef.child(`profile_images/${uid}.png`);

//   try {
//     await profileImageRef.put(defaultImagePath);
//     const imageURL = await profileImageRef.getDownloadURL();
//     return imageURL;
//   } catch (error) {
//     console.error("Error uploading default profile image: ", error);
//     return null;
//   }
// }


