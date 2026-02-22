import express from "express";
import cors from "cors";
import { db } from "./db/connection.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CodeAtlas Backend Running");
});
app.get("/test-db",async(req,res)=>{
  try {
    console.log("database connected successfully.")
    res.json({success:true,message:"DB Route working"})
  }
  catch(e){console.log(e)}
})
app.listen(5000, () => console.log("Server running on port 5000"));