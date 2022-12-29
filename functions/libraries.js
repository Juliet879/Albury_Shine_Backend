import {db} from "./index.js";
export const checkIfUserExists = async (email)=>{
  const checkEmail = await
  db.collection("employer-data").where("email", "==", email)
      .get();
  let querySnapshot;
  if (checkEmail.empty) {
    return null;
  } else {
    checkEmail.forEach((item)=>{
      querySnapshot= item.data();
    });
  }
  if (querySnapshot!== undefined) {
    return true;
  } else {
    return false;
  }
};
