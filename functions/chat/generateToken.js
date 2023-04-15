import {validationResult} from "express-validator";
import {StreamChat} from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const chatClient = StreamChat.getInstance(apiKey, apiSecret);
const getTokens =async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({
      error: "Issue with data sent , check errors for more information",
      errors,
    });
  }
  try {
    const {userId, userName} = req.body;
    if (!userId) {
      return res.status(400).json({error: "User ID is required"});
    }
    const user = await chatClient.upsertUser({
      id: userId,
      name: userName,
    });
    const token = chatClient.createToken(userId);
    res.json({user, token});
  } catch (error) {
    res.status(500).json({error: "Internal server error"});
  }
};
export default getTokens;
