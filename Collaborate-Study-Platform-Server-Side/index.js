const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Middleware
app.use(cors());
app.use(express.json());
// Start server

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdwtdhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ error: "Forbidden" });

    req.user = decoded;
    next();
  });
};
// verify admin
const verifyAdmin = async (req, res, next) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const user = await usersCollection.findOne({ email: userEmail });
    if (!user || user.role !== "admin") {
      return res.status(403).send({ error: "Forbidden: Admins only" });
    }

    next(); // user is admin, allow next middleware/route
  } catch (error) {
    console.error("verifyAdmin error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Collaborate-Study");
    const usersCollection = db.collection("users");
    const sessionsCollection = db.collection("sessions");
    const materialsCollection = db.collection("materials");
    const bookingsCollection = db.collection("bookings");
    const reviewsCollection = db.collection("reviews");
    const notesCollection = db.collection("notes");

    // for jwt local storage
    app.post("/jwt", (req, res) => {
      const user = req.body;

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.send({ token });
    });

    // users data store to server
    app.post("/users", async (req, res) => {
      try {
        const email = req.body.email;
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
          return res
            .status(200)
            .send({ message: "already email exits", inserted: false });
        }

        const result = await usersCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to register user" });
      }
    });
    // user check email and update last login time
    app.patch("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const updateData = req.body;

        if (!email || !updateData) {
          return res.status(400).send({ error: "Invalid request" });
        }

        const filter = { email: email };
        const updateDoc = {
          $set: updateData,
        };

        const result = await usersCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send({
          message: "User updated successfully",
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Failed to update user" });
      }
    });
    // Add search route
    app.get("/users", verifyToken, async (req, res) => {
      const search = req.query.search || "";
      const query = {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { displayName: { $regex: search, $options: "i" } },
        ],
      };

      try {
        const result = await usersCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch users" });
      }
    });
    // tutor find
    app.get("/users/tutors", 
       async (req, res) => {
      try {
        const tutors = await usersCollection
          .find({ role: "tutor" })
          .sort({ created_at: -1 }) // optional: newest first
          .toArray();
        res.send(tutors);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch tutors" });
      }
    });

    //  Add route to update user role

    app.patch("/users/role/:email", verifyToken,verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const newRole = req.body.role;

      try {
        const result = await usersCollection.updateOne(
          { email },
          { $set: { role: newRole } }
        );
        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (error) {
        res.status(500).send({ error: "Failed to update role" });
      }
    });

    // ✅ Only verifyToken is needed here
    app.get("/users/:email/role", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;

        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send({ role: user.role || "user" });
      } catch (error) {
        console.error("Error getting user role:", error);
        res.status(500).send({ message: "Failed to get role" });
      }
    });

    // Tutor creates a study session
    app.post("/sessions", async (req, res) => {
      try {
        const sessionData = req.body;
        sessionData.registrationFee = 0;
        sessionData.status = "pending";
        const result = await sessionsCollection.insertOne(sessionData);
        res.send({
          message: "Session created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).send({ error: "Failed to create session" });
      }
    });
    // show sessions data
    app.get("/sessions",  async (req, res) => {
      try {
        const { tutorEmail, status } = req.query;

        const query = {};
        if (tutorEmail) query.tutorEmail = tutorEmail;
        if (status) query.status = status;

        const result = await sessionsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch sessions" });
      }
    });
    app.get("/sessions/:id", async (req, res) => {
      const id = req.params.id;
      const session = await sessionsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(session);
    });

    // ✅Get sessions that have materials and a valid imageUrl
    app.get("/sessions/with-materials", async (req, res) => {
      try {
        const query = {
          hasMaterials: true,
          imageUrl: { $exists: true, $ne: "" }, // imageUrl is not empty
        };
        const result = await sessionsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: "Failed to fetch sessions with materials" });
      }
    });

    // sessions update
   app.patch("/sessions/:id", async (req, res) => {
     try {
       const id = req.params.id;
       const { status, registrationFee, rejectionReason, rejectionFeedback } =
         req.body;

       const updateFields = {
         status,
         registrationFee,
       };

       if (status === "rejected") {
         updateFields.rejectionReason = rejectionReason || "";
         updateFields.rejectionFeedback = rejectionFeedback || "";
       } else {
         // Clear rejection info if not rejected
         updateFields.rejectionReason = "";
         updateFields.rejectionFeedback = "";
       }

       const result = await sessionsCollection.updateOne(
         { _id: new ObjectId(id) },
         { $set: updateFields }
       );

       if (result.matchedCount === 0) {
         return res.status(404).send({ message: "Session not found" });
       }

       res.send({
         message: "Session updated successfully",
         modifiedCount: result.modifiedCount,
       });
     } catch (err) {
       console.error("Update session error:", err);
       res.status(500).send({ error: "Internal server error" });
     }
   });

    // delete
    app.delete("/sessions/:id",verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await sessionsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.json({ success: true });
        } else {
          res.status(404).send({ error: "Session not found" });
        }
      } catch (error) {
        console.error("Delete error:", error.message);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    // request again tutor
    app.patch("/sessions/request-again/:id", async (req, res) => {
      const { id } = req.params;
      const result = await sessionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "pending" } }
      );
      res.send(result);
    });
    // upload materials
    app.post("/materials", async (req, res) => {
      try {
        const material = req.body;

        // Insert the material into the materials collection
        const result = await materialsCollection.insertOne(material);

        // ✅ Update the session to mark it as uploaded and attach the image URL
        await sessionsCollection.updateOne(
          { _id: new ObjectId(material.sessionId) },
          {
            $set: {
              hasMaterials: true,
              imageUrl: material.imageUrl,
              driveLink: material.driveLink,
            },
          }
        );

        res.send(result);
      } catch (error) {
        console.error("Failed to upload material:", error);
        res.status(500).send({ error: "Failed to upload material" });
      }
    });

    // find email materials get data
    app.get("/materials", async (req, res) => {
      try {
        const { tutorEmail } = req.query;
        const query = tutorEmail ? { tutorEmail } : {};
        const materials = await materialsCollection.find(query).toArray();
        res.send(materials);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch materials" });
      }
    });

    // Delete method add

    app.delete("/materials/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await materialsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to delete material" });
      }
    });
    // update materials
    app.patch("/materials/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { title, driveLink, imageUrl } = req.body;

        const updateDoc = {
          $set: {
            title,
            driveLink,
            imageUrl,
          },
        };

        const result = await materialsCollection.updateOne(
          { _id: new ObjectId(id) },
          updateDoc
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to update material" });
      }
    });

    //study  page details book session store

    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        const booking = req.body;

        // Prevent duplicate booking by the same user for same session
        const existing = await bookingsCollection.findOne({
          sessionId: booking.sessionId,
          userEmail: booking.userEmail,
        });

        if (existing) {
          return res
            .status(400)
            .send({ message: "You already booked this session." });
        }

        booking.bookedAt = new Date();

        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
      } catch (err) {
        console.error("Booking failed:", err);
        res.status(500).send({ message: "Failed to book session" });
      }
    });
    // bookings by user email
    app.get("/bookings", async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        if (!userEmail) {
          return res
            .status(400)
            .json({ message: "userEmail query param required" });
        }

        const bookings = await bookingsCollection
          .find({ userEmail })
          .project({
            sessionTitle: 1,
            description: 1,
            image: 1,
            tutorName: 1,
            classStart: 1,
            classEnd: 1,
            bookedAt: 1,
            status: 1,
            fee: 1,
            driveLink: 1,
          })
          .toArray();

        res.send(bookings);
      } catch (error) {
        console.error("Failed to get bookings:", error);
        res.status(500).send({ message: "Server error" });
      }
    });
    // by booking
    app.get("/bookings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const booking = await bookingsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!booking) {
          return res.status(404).send({ message: "Booking not found" });
        }

        res.send(booking);
      } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // /bookings check email
    app.get("/bookings/check", verifyToken, async (req, res) => {
      try {
        const { email, sessionId } = req.query;

        if (!email || !sessionId) {
          return res
            .status(400)
            .send({ error: "Email and sessionId are required" });
        }

        const booking = await bookingsCollection.findOne({
          userEmail: email,
          sessionId: sessionId,
        });

        res.send(booking || null);
      } catch (error) {
        console.error("Booking check error:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    // payment stripe add

    app.post("/create-payment-intent", async (req, res) => {
      const { fee } = req.body;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: parseInt(fee * 100), // convert to cents
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Payment intent creation failed" });
      }
    });
    // Save review
    app.post("/reviews", verifyToken, async (req, res) => {
      try {
        const review = req.body;
        review.createdAt = new Date();

        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to post review" });
      }
    });

    // Get reviews for a session
    app.get("/reviews/:sessionId", async (req, res) => {
      const { sessionId } = req.params;

      try {
        const reviews = await reviewsCollection
          .find({ sessionId })
          .sort({ createdAt: -1 })
          .toArray();

        res.send(reviews);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch reviews" });
      }
    });

    // Get all reviews
    app.get("/reviews", async (req, res) => {
      try {
        const reviews = await reviewsCollection
          .find()
          .sort({ createdAt: -1 }) // Optional: latest reviews first
          .toArray();

        res.send(reviews);
      } catch (err) {
        console.error("Failed to fetch all reviews:", err);
        res.status(500).send({ error: "Failed to fetch all reviews" });
      }
    });

    // notes data store
    app.post("/notes", async (req, res) => {
      try {
        const note = req.body;
        const result = await notesCollection.insertOne(note);
        res.status(201).send(result);
      } catch (err) {
        res.status(500).send({ error: "Failed to create note" });
      }
    });
    // show notes
    app.get("/notes", async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res
            .status(400)
            .send({ error: "Email query parameter is required" });
        }

        const notes = await notesCollection
          .find({ email })
          .sort({ createdAt: -1 }) // most recent first
          .toArray();

        res.send(notes);
      } catch (err) {
        res.status(500).send({ error: "Failed to fetch notes" });
      }
    });

    app.patch("/notes/:id", async (req, res) => {
      const id = req.params.id;
      const { title, description } = req.body;

      const result = await notesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, description } }
      );

      res.send(result);
    });

    //  Delete a note
    app.delete("/notes/:id", async (req, res) => {
      const id = req.params.id;

      const result = await notesCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
