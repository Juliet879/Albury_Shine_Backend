// import admin from "firebase-admin";
// const firestore = admin.firestore();


const healthChecker = async (req, res) => {
  res.status(200).send({message: "Api works fine"});
  // await firestore.collection("checker")
  // .doc().set({details: "working great"});
};
export default healthChecker;

