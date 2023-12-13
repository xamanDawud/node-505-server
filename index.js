const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mission_505:oTafytOLc0ZnJqwJ@cluster0.lgiglma.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("mission-505").collection("users");

    app.get("/users", async (req, res) => {
      let result = await database.find().toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      let id = req.params.id;
      let cursor = { _id: new ObjectId(id) };
      let result = await database.findOne(cursor);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      let body = req.body;
      let result = await database.insertOne(body);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      let id = req.params.id;
      let user = req.body;
      let cursor = { _id: new ObjectId(id) };
      let option = { upsert: true };
      let updateUser = {
        $set: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      };
      let result = await database.updateOne(cursor, updateUser, option);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      let id = req.params.id;
      let cursor = { _id: new ObjectId(id) };
      let result = await database.deleteOne(cursor);
      res.send(result);
      console.log(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello mission 505!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
