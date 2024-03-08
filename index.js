const express = require('express');
// app.use(express()
const app = express();  
const jwt = require('jsonwebtoken')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const userCollection= client.db("bistroDb").collection("users");
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
      app.get('/carts',async(req,res)=>{
        const email = req.query.email;
        console.log(email)
        const query={
          emailId : email
        }
        const result =await cart.find(query).toArray();
        res.send(result)
      })
      app.post('/carts',async(req,res)=>{
        const itemToAdd= req.body;
        const result= await cart.insertOne(itemToAdd);
        res.send(result)

      })
      app.delete('/cart/:id',async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const result = await cart.deleteOne({itemId: id})
        res.send(result)
      })
// this is a get operation but using post for getting data
      app.post('/cart/information',async(req,res)=>{
        const target=req.body;
        console.log("testing",target)
        // const targetIDs= target.map(item=> new ObjectId(item))
        // console.log('this is target',targetIDs)
         
         const result =await menu.find({ _id: { $in : target } }).toArray()
         console.log(result)
         res.send(result)
        
      })

      // User APis 

      app.get('/users',async(req,res)=>{
        const result = await userCollection.find().toArray();
        res.send(result)
      })
      app.delete('/users/:id',async(req,res)=>{
        const id= req.params.id;
        console.log("deleting user ",id)
        const result= await userCollection.deleteOne({_id: new ObjectId(id)})
        res.send(result )
      })
      app.post('/user',async(req,res)=>{
        const user = req.body;
        const existence= await userCollection.findOne({userEmail: user.userEmail})
        if(existence){
          return res.send({massage:'user exists' ,insertedId:null})
        }
        const result =await userCollection.insertOne(user)
        res.send(result)
      })
      // UserApi to make Admin 
      app.patch('/user/Admin/:id',async(req,res)=>{
        const id=req.params.id;
        const filter = {
          _id:new ObjectId(id)
        }
        const updatedDoc= {
          $set:{
            role:"Admin"
          }
        }
        const result= await userCollection.updateOne(filter,updatedDoc)
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


// jwt APis
app.post('/jwt',(req,res)=>{
  const user=req.body;
  const token = jwt.sign(user,process.env.SECRET_TOKEN,{expiresIn:'1h'})
  res.send({token})
})
app.listen(Port ,()=>{  
    console.log(`boss stting on the server on Port ${Port} `)
})