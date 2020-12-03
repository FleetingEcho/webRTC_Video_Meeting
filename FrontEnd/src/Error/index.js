import React, { Component, Fragment } from 'react'
import {GlobalStyle} from '../Video/style';
import {GithubOutlined} from '@ant-design/icons';
import {withRouter } from 'react-router';

class Error extends Component {
  constructor (props) {
  super(props)
}


render(){
  return (
    <Fragment>
    <GlobalStyle></GlobalStyle>
    <div style={{width: "100%", height:'30%', paddingTop: "20vh", padding:'auto',textAlign: "center", justifyContent: "center"}}>
      <h2 style={{color:'white'}}>Sorry, currently only supports Chrome Browser </h2>
      <h5 style={{lineHeight:'30px',marginTop:'60px'}}>
        <span style={{verticalAlign:'middle'}}>
      <span style={{display:'inline-block',height:'30px',marginRight:'10px'}}>	
        <GithubOutlined style={{verticalAlign:'middle'}}/> 
      </span>
      <a href="https://github.com/JakeZT">Other repo in my Github</a></span>
      </h5>
    </div>
  </Fragment>
  )
}


}

export default withRouter(Error)