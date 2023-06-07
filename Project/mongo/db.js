const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Todi:Zeratul3637@cluster0.gnswdia.mongodb.net/test?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
connectDB().catch(console.dir);

module.exports = connectDB;