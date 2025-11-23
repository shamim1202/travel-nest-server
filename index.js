const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const connectToDB = require("./mongodb");
// const bodyParser = require("body-parser");
// const countryRoutes = require("./routes/countries");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Travel Nest Server Is Running");
});

app.get("/hotel-resourts", async (req, res) => {
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
// app.use(bodyParser.json());

// API routes
// app.use("/api/countries", countryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
