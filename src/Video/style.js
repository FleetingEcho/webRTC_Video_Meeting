import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import img from '../Home/wallpaper.png'

export const GlobalStyle = createGlobalStyle`
html, body {
  background:url(${img}) repeat-Y center center;
  ${'' /* overflow: hidden; */}
${'' /* position: fixed; */}
text-align:center;
  width:100%;
  height: 100%;
	/* 背景图垂直、水平均居中 */
	${'' /* background-position: center; */}
	/* 背景图不平铺 */
	background-repeat: repeat-Y;
	/* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
	background-attachment: fixed;
	/* 让背景图基于容器大小伸缩 */
	background-size: cover;
	/* 设置背景颜色，背景图加载过程中会显示背景色 */
	background-color: #464646;

}
${'' /* body {
margin: 0;
text-align: center;
} */}
`
export const IconList = styled.div`
  z-index: 2;
  position: fixed; 
  bottom: 0px;
  width: 100%;
  height: auto;
`


export const MessageContainer = styled.div`
${'' /* clear: left; */}

  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  max-height: 100vh;

  align-items: center;
  justify-content: center;
  text-align: center;
`

export const VideoBox = styled.video`
${'' /* cursor:pointer; */}
    ${'' /* transform: rotateY(180deg); */}
    ${'' /* border: 3px solid rgb(255 255 255); */}
    margin: 30px 10px 80px;
    object-fit: fill;
    ${'' /* width: 100%; */}
    min-height: 40%;
    max-width: 90%;
    max-height: 90%;
    min-width: 30%;
    border-radius: 20px;
`

export const Sender= styled.div`
float:right;
width:60px;
${'' /* max-width:25%; */}
${'' /* margin-top:50%; */}
`;

export const MessageBox = styled.div`
float:right;
margin-right:2%;
textAlign: right;
    max-width: 60%;
    max-height: 50%;
    margin-bottom: 16px;
    ${'' /* margin-right:80px; */}
    ${'' /* right:-65px; */}
    background-color: green;
    border-bottom-color: green;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 7%;
    right: -3px;
    width: 10px;
    height: 10px;
    ${'' /* margin-top: -10px; */}
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
    }
`;
export const ImageBox = styled.div`
float:right;
margin-right:2%;
    max-width: 60%;
    max-height: 60%;
    margin-bottom: 16px;
    background-color: white;
    border-bottom-color: white;
    /*为了给after伪元素自动继承*/
    color: #fff;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 7%;
    right: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: rotate(45deg);
    }
`;


export const ImageBoxLeft = styled.div`
    float:left;
    max-width: 60%;
    max-height: 60%;
    margin-bottom: 16px;
    background-color: white;
    border-bottom-color: white;
    /*为了给after伪元素自动继承*/
    color: #fff;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 6%;
    left: -3px;
    width: 10px;
    height: 10px;
    ${'' /* margin-top: -10px; */}
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
}
`;



export const UserContainer = styled.div`
${'' /* float:right; */}
margin-right:0px;
max-width: 100%;
max-height: 500px;
min-height: 50px;
&:after{
  content: '';
    height: 0;
    display: block;
    clear: both;
}
`;


export const SenderLeft= styled.div`
float:left;
width:60px;
`

export const MessageBoxLeft = styled.div`
${'' /* left:-65px; */}
${'' /* clear: right; */}
    float:left;
    margin-left:-3%;
    margin-top:0.5vh;
    max-width: 60%;
    max-height: 100%;
    margin-bottom: 16px;
    ${'' /* margin-left:20px; */}
    ${'' /* margin-right: calc(100%-150px); */}
    background-color: #049485;
    border-bottom-color: #049485;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    padding: 5px 8px 5px 8px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 6%;
    left: -3px;
    width: 10px;
    height: 10px;
    ${'' /* margin-top: -10px; */}
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
}
`;

