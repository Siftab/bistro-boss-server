const express = require('express');
// app.use(express()
const app = express();  
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const Port = process.env.PORT || 5000;


// middleWear
app.use(cors());
app.use(express.json());
require('dotenv').config()
// Mongo Uri
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.i7jrqrv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // sdjisokd

        const menu= client.db("bistroDb").collection("menu");
        const reviews= client.db("bistroDb").collection("reviews");
        const cart= client.db("bistroDb").collection("cart");


      await client.connect();



      app.get('/reviews', async(req,res)=>{
        console.log("hitting for reviews")
        const result = await reviews.find().toArray();
        res.send(result)
      })

      app.get('/menu',async(req,res)=>{
        console.log("hitting for menu")
        const result = await menu.find().toArray();
        res.send(result)
      })

      // Cart data 
      app.post('/carts',async(req,res)=>{
        const itemToAdd= req.body;
        const result= await cart.insertOne(itemToAdd);
        res.send(result)

      })






      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("Bistro boss on the ways ")
})
app.listen(Port ,()=>{  
    console.log(`boss stting on the server on Port ${Port} `)
})