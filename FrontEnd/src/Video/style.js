import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import img from '../Home/wallpaper.png'

export const GlobalStyle = createGlobalStyle`
html, body {
  background:url(${img}) repeat-Y center center;
${'' /* text-align:center; */}
  width:100%;
  height: 100%;

	background-repeat: repeat-Y;
	background-attachment: fixed;
	background-size: cover;
	background-color: #464646;
}`

export const IconList = styled.div`
  z-index: 2;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: auto;
`
export const DrawerItem=styled.div`
margin-bottom:15px;
background-color: #118ab2;
background-image: linear-gradient(319deg, #118ab2 0%, #06d6a0 37%, #ffd166 100%);
border-radius:20px;
height:40px;
font-family: Times, TimesNR, 'New Century Schoolbook',Georgia, 'New York', serif;
`;
export const IconImages = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
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
  min-height: 40%;
  max-width: 90%;
  max-height: 90%;
  min-width: 30%;
  border-radius: 20px;
`

export const Sender = styled.div`
  float: right;
  ${'' /* width: 60px; */}
`

export const MessageBox = styled.div`
  float: right;
  margin-right: 3%;
  textalign: right;
  max-width: 60%;
  max-height: 50%;
  margin-bottom: 16px;
  background-color: green;
  border-bottom-color: green;
  /*为了给after伪元素自动继承*/
  color: #fff;
  font-size: 14px;
  line-height: 18px;
  padding: 6px 8px 0px 7px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    right: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: rotate(45deg);
  }
`
export const ImageBox = styled.div`
  float: right;
  margin-right: 3%;
  max-width: 60%;
  max-height: 60%;
  margin-bottom: 16px;
  background-color: white;
  border-bottom-color: white;
  color: #fff;
  padding: 6px 8px 4px 7px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    right: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: rotate(45deg);
  }
`

export const ImageBoxLeft = styled.div`
  float: left;
  margin-left: -3%;
  max-width: 60%;
  max-height: 60%;
  margin-bottom: 16px;
  background-color: white;
  border-bottom-color: white;
  color: #fff;
  padding: 6px 8px 4px 7px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -3px;
    width: 10px;
    height: 10px;
    background: inherit;
    transform: rotate(45deg);
  }
`

export const UserContainer = styled.div`
  margin-right:0px;
  max-width: 100%;
  min-height: 50px;
  &:after {
    content: '';
    height: 0;
    display: block;
    clear: both;
  }
`

export const SenderLeft = styled.div`
  float: left;
  width: 60px;
`

export const MessageBoxLeft = styled.div`
    float:left;
  margin-left: -3%;
  margin-top: 0.5vh;
  max-width: 60%;
  margin-bottom: 16px;
    background-color: #049485;
  border-bottom-color: #049485;
  /*为了给after伪元素自动继承*/
  color: #fff;
  font-size: 14px;
  line-height: 18px;
  padding: 6px 8px 0px 7px;
  box-sizing: border-box;
  border-radius: 6px;
  position: relative;
  word-break: break-all;
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -3px;
    width: 10px;
    height: 10px;
    ${'' /* margin-top: -10px; */}
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
  }
`
