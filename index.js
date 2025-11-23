const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const connectToDB = require("./mongodb");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Travel Nest Server Is Running");
});

app.get("/top-resourts", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const cursor = db.collection("hotel-resourts").find().limit(4);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch data" });
  }
});

app.get("/hotels", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const cursor = db.collection("hotel-resourts").find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
