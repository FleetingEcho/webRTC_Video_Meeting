/* 
{
iconList:{
room1: []
}
}
*/

class IconList{
  constructor(){
    this.iconList={};
  }
  /* 
  {
    room1:{
      id1: icon,
      id2:icon
    }
  }
  */
  // 增加
  addIcon=(id,icon,socketId)=>{
    if(this.iconList[`room${id}`]){
      this.iconList[`room${id}`][socketId]=icon
    }
    else{
      // 初始化
      this.iconList[`room${id}`]={};
      this.iconList[`room${id}`][socketId]=icon;
    }
  }

  showIcon=(id)=>{
    return this.iconList[`room${id}`]
  }
  listAll=()=>{
    return this.iconList
  }
  
  delIcon=(id,socketId)=>{
    if(!id )return ;
    let info =this.iconList[`room${id}`];
    if(Object.keys(info).length<=1){
      delete this.iconList[`room${id}`];
    }
    else{
      delete this.iconList[`room${id}`][socketId]
      }
  }
  
}


exports.iconList= new IconList();