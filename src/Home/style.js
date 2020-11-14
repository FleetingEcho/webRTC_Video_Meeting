import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import img from './wallpaper.png'
export const GlobalStyle = createGlobalStyle`
body {

  background:url(${img}) no-repeat top;
margin: 10;
text-align: center;
position: fixed;
  width:100%;
  height: 100vh;
	background-position: center center;
	background-repeat: repeat-Y;
	background-attachment: fixed;
	background-size: cover;
	background-color: #464646;

}
`

export const Title = styled.h1`
${'' /* fontSize: "45px"; */}
${'' /* color:#0d918c; */}
margin-bottom:20px;
color:white;
`


export const InfoBox = styled.div`
width: 70%;
color:white;
height: auto;
padding: 20px; 
minWidth: 200px;
textAlign: center;
margin: auto;
marginTop: 100px;
&.p{
  margin: 0;
  fontWeight: bold;
  paddingRight: 20px; 
}

`
export const CenterBox = styled.div`
position: absolute;
width: 500px;
height: 300px;
top: 45%;
left: 50%;
transform: translate(-50%, -50%);
`