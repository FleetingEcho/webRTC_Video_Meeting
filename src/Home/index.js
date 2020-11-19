import React, { Component, Fragment } from 'react';
import { Input } from '@material-ui/core';
import {withRouter } from 'react-router';
import { Button as ButtonAnt } from 'antd';
import {CenterBox,GlobalStyle,InfoBox ,Title} from './style'
import { message } from 'antd'
import 'antd/dist/antd.css'
import {enterRoom} from '../Api/request'
import {STATUS} from  './status'
import hash from 'object-hash';

class Home extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			room: '',
			password:'',
		}
	}

	handleChange = (e) => this.setState({ room: String(e.target.value).trim() })
	handleChangeP = (e) => this.setState({ password: String(e.target.value).trim() })
	clearInfo=()=>{
		this.setState({room:'',password:''},()=>{
			this.forceUpdate()
		})
	}

	join = () => {

		let roomId=this.state.room;
		let password=this.state.password;
		if(!roomId){
				message.error('roomID cannot be empty!')
				return false;
		}
		if(!password){
				message.error('password cannot be empty!')
				return false;
		}
				// 路由跳转
				const info={
					roomId:roomId,
					password:hash(password),
					originalP:password
				}
				enterRoom(info).then((res)=>{
					this.setState({room:'',password:''},()=>{
						// 清空后callback
						let CODE=res.result.status;
						if(CODE===STATUS.JOIN){ 
							message.success(`Joined Successfully`,0.6);
							this.props.history.push({pathname:'/room',state:info})
							return;
						}
						else if(CODE===STATUS.PASSWORD_ERROR){ 
							message.error(`Room password mismatch`,0.5);
							this.clearInfo();
							return;
						}
						else if(CODE===STATUS.FULL){ 
							message.error(`Room full`,0.5);
							this.clearInfo();
							return;
						}
						else if(CODE===STATUS.ROOM_NOT_EXIST){ 
							message.error(`Room didn't exist`,0.5);
							this.clearInfo();
							return;
						}
					})
			}).catch(err=>console.log(err))
	}

	render() {
		return (
				<Fragment>
				<GlobalStyle></GlobalStyle>
							<CenterBox >
								<div>
									<Title >Video Meeting</Title>
									<p style={{ fontWeight: "180" ,color:'#5feeff', fontSize:'18px',fontStyle:'italic'}}>Free video meeting with WebRTC Technology</p>
								</div>

								<InfoBox>
									<p style={{fontSize:'18px'}} >Create or join a Room</p>
									<Input value={this.state.room} style={{color:'white'}} placeholder="Room ID" onChange={e => this.handleChange(e)} />
									<Input
									value={this.state.password}
									type="password"
									placeholder="input password"
									autoComplete="false"
									  style={{color:'white',marginTop:'20px'}}  onChange={e => this.handleChangeP(e)} />
									<div>
									<ButtonAnt type="primary" onClick={this.join} style={{ margin: "20px" }}>Go</ButtonAnt>
									</div>
								</InfoBox>
							</CenterBox>
				</Fragment>
		)
	}
}

export default withRouter(Home);