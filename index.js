const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors())
app.use(express.json())

app.get('/', (req,res)=> {
    res.send('Genius Car Server Running!')
})



// mongodb code



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tslfjs6.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('geniusCar').collection('services');
        // create new collection for orders
        const ordersCollection = client.db('geniusCar').collection('orders');

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // orders api
        app.get('/orders', async(req, res)=>{
            let query = {};
            // jodi query er vitor email === true;;;
            // then query?email er value hobe email
            //      /orders?email="email"
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })
        
        // express post method to create new data in db
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        }) 


        app.patch('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const status = req.body.status;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set:{
                    status: status,
                }
            }
            const result = await ordersCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })



        // delete
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })
      
        


    }
    finally{

    }
}
run().catch(e=>console.log(e))





app.listen(port, ()=>{
    console.log(`genius car server running on ${port}`);
})
