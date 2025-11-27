const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// Middleware ----------------------------------------------->
app.use(cors());
app.use(express.json());

// Mongodb Connection Link ----------------------------------->
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qx9mzcm.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Travel Nest Server Is Running");
});

async function run() {
  try {
    const db = client.db("travel-nest");
    // const habitsCollection = db.collection("habits");

    // Top Resourts/Hotel Show Get Api ------------------------------>
    app.get("/top-resourts", async (req, res) => {
      try {
        const cursor = db.collection("hotel-resourts").find().limit(4);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to fetch data" });
      }
    });

    // All Hotel Show Get Api --------------------------------------->
    app.get("/hotels", async (req, res) => {
      try {
        const cursor = db.collection("hotel-resourts").find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ error: "Failed to fetch all hotels/resourts data" });
      }
    });

    // Top Room Show Get Api ---------------------------------------->
    app.get("/top-rooms", async (req, res) => {
      try {
        const type = req.query.type;
        const cursor = db.collection("rooms").find({ type }).limit(3);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to fetch rooms data" });
      }
    });

    // All Rooms Show Get Api --------------------------------------->
    app.get("/rooms", async (req, res) => {
      try {
        const query = {};
        const cursor = db.collection("rooms").find(query).limit(9);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to fetch rooms data" });
      }
    });

    // Specific Id Wise Room Details Get Api ------------------------>
    app.get("/rooms/:id", async (req, res) => {
      try {
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

    // Booking Room Details Get Api --------------------------------->
    app.get("/my-bookings/:userId", async (req, res) => {
      try {
        const { userId } = req.params;

        const bookings = await db
          .collection("bookings")
          .find({ userId })
          .sort({ _id: -1 })
          .toArray();

        res.send(bookings);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch bookings" });
      }
    });

    // Room Booking Post Api --------------------------------------->
    app.post("/booking-room", async (req, res) => {
      try {
        const bookingData = req.body;

        // Validate required fields
        const requiredFields = [
          "roomId",
          "userId",
          "name",
          "email",
          "phone",
          "checkIn",
          "checkOut",
          "guests",
        ];
        for (let field of requiredFields) {
          if (!bookingData[field]) {
            return res.status(400).send({ error: `${field} is required` });
          }
        }

        const result = await db.collection("bookings").insertOne(bookingData);
        res.status(201).send({
          message: "Booking successful",
          bookingId: result.insertedId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to book room" });
      }
    });

    // Update A Booked Room Update Api ----------------------------->
    app.put("/bookings/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await db
          .collection("bookings")
          .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Booking not found" });
        }

        res.send({ message: "Booking updated successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update booking" });
      }
    });

    // Delete A Booked Room Delete Api ----------------------------->
    app.delete("/bookings/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await db
          .collection("bookings")
          .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Booking not found" });
        }

        res.send({ message: "Booking deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete booking" });
      }
    });

    // Create A New Hotel/Resourts Post Api ------------------------>
    app.post("/add-hotel", async (req, res) => {
      try {
        const {
          hotel,
          location,
          image,
          desc,
          regularPrice,
          pricePerDay,
          dateFrom,
          dateTo,
        } = req.body;

        if (!hotel || !location || !image) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newHotel = {
          hotel,
          location,
          image,
          desc,
          regularPrice: parseInt(regularPrice),
          pricePerDay: parseInt(pricePerDay),
          dateFrom,
          dateTo,
        };

        const result = await db.collection("hotel-resorts").insertOne(newHotel);
        res.status(201).json({ success: true, hotel: result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add hotel" });
      }
    });
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
