 export const changeCssVideos = (main,elms) => {
  let widthMain = main.offsetWidth
  let minWidth = "30%";
  let maxHeight='90%';
  if ((widthMain * 30 / 100) < 300) {
    minWidth = "300px"
  }
  let minHeight = "40%"

  let height = String(100 / elms) + "%"
  let width = ""
  if(elms === 0 || elms === 1) {
    width = "100%"
    height=maxHeight
  } else if (elms === 2) {
    width = "45%"
    height=maxHeight
  } else if (elms === 3) {
    width = "30%"
    height = "65%"
  } else if (elms === 4) {
    width = "38%"
    height = "50%"
  } 
  else {
    width = String(100 / elms) + "%"
  }

  let videos = main.querySelectorAll("video")
  for (let a = 0; a < videos.length; ++a) {
    videos[a].style.minWidth = minWidth
    videos[a].style.minHeight = minHeight
    videos[a].style.maxHeight = maxHeight
    videos[a].style.setProperty("width", width)
    videos[a].style.setProperty("height", height)
    // videos[a].addEventListener('click', function(e) {
    //   handleFullscreen(e);
    //  });

    // videos[a].addEventListener("click",toggleVideoSize,false);
  }

  return {minWidth, minHeight, width, height}
}

export const getBase64=(file)=>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const checkMessage=(message)=>{
  // 图片？data:image/
  if(message.indexOf("data:image")>=0 ||
    message.indexOf("blob:http")>=0
  ){
    return true
  }
  return false;
  // 正则貌似不太好用，有error
  // const pattern=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  // const pattern=/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/
  // return pattern.test(message)

}
export const toggleVideoSize=(e)=>{
  // console.log(e)
  // var flag;
  // if(!flag){
  //   e.style.videoWidth='100%'
  //   e.style.videoHeight='100%'
  //   var flag=true
  // }
  // else{
  //   e.style.removeAttribute("videoWidth");
  //   e.style.removeAttribute("videoHeight");
  //   var flag=null
  // }

	// if(e.requestFullScreen){
	// 	e.requestFullScreen();
	// } else if(e.webkitRequestFullScreen){
	// 	e.webkitRequestFullScreen();
	// } else if(e.mozRequestFullScreen){
	// 	e.mozRequestFullScreen();
	// }


}
// 滚动条置底
export const scrollToBottom=()=>{
  let dom=document.getElementById("messageBody")
  if(!dom){ return true}
  // dom.scrollTop(dom.scrollHeight);
  dom.scrollTo({
    top: dom.scrollHeight,
    left: 0,
    behavior: 'smooth'
  });
}




export  const handleFullscreen = function(e) {
  if (isFullScreen()) {
     if (document.exitFullscreen) document.exitFullscreen();
     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
     else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
     else if (document.msExitFullscreen) document.msExitFullscreen();
     setFullscreenData(e,false);
  }
  else {
     if (e.target.requestFullscreen) e.target.requestFullscreen();
     else if (e.target.mozRequestFullScreen) e.target.mozRequestFullScreen();
     else if (e.target.webkitRequestFullScreen) e.target.webkitRequestFullScreen();
     else if (e.target.msRequestFullscreen) e.target.msRequestFullscreen();
     setFullscreenData(e,true);
  }
}
export const isFullScreen = function() {
return !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}
export const setFullscreenData = function(e,state) {
e.target.setAttribute('data-fullscreen', !!state);
}