const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const connectToDB = require("./mongodb");
const { ObjectId } = require("mongodb");

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
    res.status(500).send({ error: "Failed to fetch all hotels/resourts data" });
  }
});

app.get("/top-rooms", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const type = req.query.type;
    const cursor = db.collection("rooms").find({ type }).limit(3);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch rooms data" });
  }
});

app.get("/rooms", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const query = {};
    const cursor = db.collection("rooms").find(query).limit(9);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    req.status(500).send({ error: "Failed to fetch rooms data" });
  }
});

app.get("/rooms/:id", async (req, res) => {
  try {
    const { db } = await connectToDB();
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Room ID" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await db.collection("rooms").findOne(query);
    if (!result) return res.status(404).send({ error: "Room not found" });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch room" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
