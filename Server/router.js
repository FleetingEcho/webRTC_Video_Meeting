const express=require('express');
const router = express.Router({});
const {connector}=require('./db')
const {iconList}=require('./iconList')
const xss = require("xss")

const filterString = (str) => {
	return xss(str)
}

//join
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

// leave
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

// update
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


// fetch iconList
router.post('/list', (req,res) => {
  let id=filterString(req.body.roomId)
  console.log('头像是'+id)
  const info=iconList.showIcon(id);
  res.json({
    status_code:201,
    result:{
      'usedIcon':info
    }
  })
  });

  
module.exports= router