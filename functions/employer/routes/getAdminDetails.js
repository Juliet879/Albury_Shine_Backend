import {getAdminDetails} from "../../libraries.js";

const getEmployer = async (req, res) =>{
  const {userId} = req.params;
  if (!userId) {
    res.status(422).send({
      error: "No params found",
    });
  }
  try {
    const permissionLevel = req.user.permissionLevel;
    if (permissionLevel !== "admin") {
      res.status(400).send({message: "User not authorized!"});
    }
    const user = await getAdminDetails(userId);
    if (!user) {
      res.status(400)
          .send({
            status: 400,
            success: false,
            error: "User not found",
          });
    } else {
      const data ={
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      };
      res.status(200)
          .send({
            status: 200,
            success: true,
            data: data,
          });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      error: error.message,
    });
  }
};
export default getEmployer;
