import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import img from '../Home/wallpaper.png'

export const GlobalStyle = createGlobalStyle`
html, body {
  background:url(${img}) repeat-Y center center;
text-align:center;
  width:100%;
  height: 100%;
	background-repeat: repeat-Y;
	background-attachment: fixed;
	background-size: cover;
	background-color: #464646;

}`;


export const IconList = styled.div`
  z-index: 2;
  position: fixed; 
  bottom: 0px;
  width: 100%;
  height: auto;
`


export const IconImages = styled.img`
height:50px;
width:50px;
border-radius:50%;
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
`;

export const MessageBox = styled.div`
float:right;
margin-right:2%;
textAlign: right;
    max-width: 60%;
    max-height: 50%;
    margin-bottom: 16px;
    background-color: green;
    border-bottom-color: green;
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    padding: 5px 6px 5px 6px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 8%;
    right: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
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
    padding: 5px 6px 5px 6px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 8%;
    right: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: rotate(45deg);
    }
`;


export const ImageBoxLeft = styled.div`
    float:left;
    margin-left:-2%;
    max-width: 60%;
    max-height: 60%;
    margin-bottom: 16px;
    background-color: white;
    border-bottom-color: white;
    /*为了给after伪元素自动继承*/
    color: #fff;
    padding: 5px 6px 5px 6px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
    &::before {
    content: '';
    position: absolute;
    top: 8%;
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
max-height: 100%;
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
    float:left;
    margin-left:-2%;
    margin-top:0.5vh;
    max-width: 60%;
    max-height: 100%;
    margin-bottom: 16px;
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
    top: 8%;
    left: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
}
`;

