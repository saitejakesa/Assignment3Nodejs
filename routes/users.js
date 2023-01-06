var express = require('express');
var router = express.Router();
const {mongodb,dbName,dbUrl,MongoClient} = require('../dbconfig')
const client=new MongoClient(dbUrl)
let booked=false
var dateTime = new Date();
router.get('/rooms', async(req, res)=> {
  // data={
    //   roomID:req.body.roomID,

    //   amenities:req.body.amenities,
    //   price:req.body.price,
    //   bookedStatus:"Available",
    //   customerName:"",
    //   date:"", 
    //   startTime:"",
    //   endTime:""
    // }
  await client.connect()
  try{
    const db =await client.db(dbName)
    let requests = await db.collection('RoomCreation').find().toArray();
    res.send({
      statusCode:200,
      data:requests
    })
  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});

router.post('/rooms', async(req, res)=> {
  await client.connect()
  try{
    data={
      roomID:"",
      Seats_Available:"",
      amenities:"",
      price:"",
    }
    const db =await client.db(dbName)
    let requests = await db.collection('RoomCreation').insertOne(req.body);
    res.send({
      statusCode:200,
      data:requests,
      message:"Data saved Successfully"
    })
  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});
router.post('/booking',async(req,res)=>{
  await client.connect()
  try{
    data={
      Customer_Name:"",
      Date:"", 
      Start_Time:"",
      End_Time:"",
      room_ID:""
    }
    const db =await client.db(dbName)
    //let a=db.collection('RoomCreation').find()
    let requests = await db.collection('RoomCreation').find({room_ID:req.body.room_ID}).toArray();
    console.log(requests)
    
    if(requests[0].Booked_Status===true){
      res.send({
        statusCode:400,
        message:"Room is full"
      })
    }
    else{
      let postroom=await db.collection('roombook').insertOne(req.body);
      let room=await db.collection("RoomCreation").findOneAndUpdate({room_ID:req.body.room_ID},{$set:{Booked_Status:true,Customer_Name:req.body.Customer_Name,Date:req.body.Date,Start_Time:req.body.Start_Time,End_Time:req.body.End_Time}})
      console.log(room)
      res.send({
        statusCode:200,
        data:room,
        message:"Room is created for you succesfully"
      })
    } 
   
  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      booked:false,
      error
    })
  }
  finally{
    client.close()
  }        
  
})


router.get('/booked', async(req, res)=> {
  await client.connect()
  try{

    const db =await client.db(dbName)
    let requests = await db.collection('RoomCreation').find({Booked_Status:true}).project({
      _id:0,
      room_ID:1,
      Booked_Status:1,
      Customer_Name:1,
      Date:1,
      Start_Time:1,
      End_Time:1,
    }).toArray()
    console.log(requests)
    res.send({
      statusCode:200,
      data:requests
    })
  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});

router.get('/customer', async(req, res)=> {
  await client.connect()
  try{

    const db =await client.db(dbName)
    let requests = await db.collection('RoomCreation').find({Booked_Status:true}).project({
      _id:0,
      Customer_Name:1,
      room_ID:1,
      Date:1,
      Start_Time:1,
      End_Time:1,
    }).toArray()
    console.log(requests)
    res.send({
      statusCode:200,
      data:requests
    })
  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});


router.put('/checkout',async(req,res)=>{
  await client.connect()
    
  try{
    data={
      room_ID:""
    }
    const db =await client.db(dbName)
    let requests=await db.collection("RoomCreation").find({room_ID:req.body.room_ID}).toArray();
    console.log(requests)
    if(requests[0].Booked_Status===false){
      res.send({
        statusCode:400,
        message:"Room is empty so no need to check out"
      })
    }
      else{
        let checkout=await db.collection('RoomCreation').findOneAndUpdate({room_ID:req.body.room_ID},{$set:{Booked_Status:false},$unset:{Customer_Name:req.body.Customer_Name,Date:req.body.Date,Start_Time:req.body.Start_Time,End_Time:req.body.End_Time}})
        res.send({
          statusCode:200,
          data:checkout,
          message:"Checing out succesfull"
        })
      }

  }
  catch(error){
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
  });





// router.get('/rooms/:room_ID', (req, res)=>{
//   getRoomById = roomID => roomsData.find(i => i.room_ID == roomID);
//   if(req.params.room_ID==roomsData.room_ID){
//     res.send({
//       statusCode:200,
//       data:roomID =>roomsData.find(i =>i.room_ID ==roomID)
//     })
//   }
//   else{
//     res.send({
//       statusCode:400,
//       message:"Invalid Room ID"
//     })
//   }
// })

module.exports = router;
