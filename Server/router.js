const express=require('express');
// const Connections=require('./db')
const {connector}=require('./db')
const router = express.Router({});
// const connector= new Connections();
const xss = require("xss")

const filterString = (str) => {
	return xss(str)
}

// join room
router.post('/room', (req,res) => {

let id=filterString(req.body.roomId)
let password=filterString(req.body.password)
let access=connector.enterRoom(id,password)
res.json({
  status_code:201,
  result:{
    'status':access
  }
})
});

// leave room
router.delete('/room', (req,res) => {
// console.log(req.body);
let id=filterString(req.body._id)
let password=filterString(req.body._password)
let access=connector.leaveRoom(id,password)
res.json({
  status_code:201,
  result:{
    'status':access
  }
})
});

router.put('/room', (req,res) => {
let id=filterString(req.body.roomId)
let password=filterString(req.body.password)
let socketId=filterString(req.body.socketId)
let access=connector.updateSocket(id,password,socketId)
console.log(socketId)
res.json({
  status_code:201,
  result:{
    'status':access
  }
})
});

module.exports= router