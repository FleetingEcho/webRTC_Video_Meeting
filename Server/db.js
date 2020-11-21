// let connectedRooms={};
const STATUS={
  JOIN:1001,
  PASSWORD_ERROR:1002,
  FULL:1003,
  LEAVE:1004,
  ROOM_NOT_EXIST:1005,
  UPDATE:1006
}
/* 
{
    room12345:{
    id:'12345',
    password:'ppp111qqq',
    linkedUsers:1
  }
}
*/

class Connections{
  constructor(){
    this.connectedRooms={};
  }
  // 增加
  _access=(id,password)=>{
    let info=this.connectedRooms[`room${id}`];
    // password right
    if(info['id']===id && info['password']===password){
      // access
      if(info.linkedUsers>=6){
        return STATUS.FULL;
      }
        return this._goInRoom(id,password);
    }
    // password error
    else if(info['id']!==id || info['password']!==password){
          return STATUS.PASSWORD_ERROR
    }
  }
  enterRoom=(id,password)=>{
  // new room
  // console.log(this.connectedRooms)
    if(!this.connectedRooms[`room${id}`]){
    let room={
      'id':id,
      'password':password,
      'linkedUsers':0
    }
    this.connectedRooms[`room${id}`]=room;
    return this._goInRoom(id,password);
  }else{
   return this._access(id,password)
  
  }
  }
  
  leaveRoom=(id)=>{
    if(!id )return ;
    if(! this.connectedRooms[`room${id}`]){
      return STATUS.ROOM_NOT_EXIST ;
    }
    let info =this.connectedRooms[`room${id}`];
    if(info['linkedUsers']<=1){
      delete this.connectedRooms[`room${id}`];
      console.log(this.connectedRooms)
      return STATUS.ROOM_NOT_EXIST;
    }
    else{
        info['linkedUsers']-=1;
       return STATUS.LEAVE;
      }
  }
  
  _goInRoom=(id,password)=>{
    if(this.connectedRooms[`room${id}`] && this.connectedRooms[`room${id}`]['password']===password){
      this.connectedRooms[`room${id}`]['linkedUsers']+=1;
      // 路由跳转   隐式传递数据
      console.log(this.connectedRooms)
      return STATUS.JOIN;
    }
    else if(this.connectedRooms[`room${id}`]){
      return STATUS.PASSWORD_ERROR
    }
    else if(! this.connectedRooms[`room${id}`]){
      return STATUS.ROOM_NOT_EXIST
    }
  }
  
  
  
  updateSocket=(roomId,password,socketId)=>{
    if(! this.connectedRooms[`room${roomId}`]){
      return STATUS.ROOM_NOT_EXIST
    }
    this.connectedRooms[`room${roomId}`]['socketId']=socketId;
    return STATUS.UPDATE
  }
}


exports.connector= new Connections();