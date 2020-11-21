import React, { Component, Fragment } from 'react'
import io from 'socket.io-client'
import faker from "faker"
// ICONS
import {IconButton, Badge} from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare'
import CallEndIcon from '@material-ui/icons/CallEnd'
import ChatIcon from '@material-ui/icons/Chat'
import icon1 from './icon/icon1.jpg'
import icon2 from './icon/icon2.jpg'
import poster from  './icon/poster.png'
import poster2 from  './icon/poster2.png'
import videoCanvas from 'video-canvas'
// import html2canvas from 'html2canvas'
import {ShakeOutlined } from '@ant-design/icons';
import {changeCssVideos, checkMessage,getBase64,scrollToBottom,toggleVideoSize} from '../lib/utils'
import {MessageBox,MessageBoxLeft,UserContainer,Sender,
			  SenderLeft,
	      VideoBox,IconList,MessageContainer,GlobalStyle,ImageBox,ImageBoxLeft} from './style';
import chatWallPaper from './icon/chatWallPaper.jpg'
import { message, Modal as AntModal,Button as ButtonAnt,Image,Input,Upload } from 'antd'
import 'antd/dist/antd.css'
import { UploadOutlined ,CameraOutlined,GithubOutlined} from '@ant-design/icons';
import {withRouter } from 'react-router';
import { Row } from 'reactstrap'
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.css'
import "./index.css"
const server_url = "//192.168.0.19:4000"

var connections = {}
// connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
const peerConnectionConfig = {
	'iceServers': [
		{ 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null
var elms = 0
class Video extends Component {
	constructor(props) {
		super(props)
		this.localVideoref = React.createRef()
		this.shareScreen = React.createRef()


		this.videoAvailable = false
		this.audioAvailable = false

		this.state = {
			screenVisible:false,
			screenData:[],
			flipList:[],
			fileList:[],
			roomId:'',
			password:'',
			flipVideo:'',
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			screenAvailable: false,
			messages: [],
			message: "",
			newmessages: 0,
			askForUsername: true,
			username: faker.internet.userName(),
		}
		connections = {}
		this.checkPermission(props);
	}
	checkPermission(props){
		if(! props.location.state){
			//  ! props.location.state.password 
			message.error(`Please log in`,0.5)
			this.props.history.push({pathname:'/'})
		}
		else{
			console.log(this.props.location.state.roomId);
			this.getPermissions(props)

			return true;
			}
	}

	getPermissions = async (props) => {
		try{
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.videoAvailable = true)
				.catch(() => this.videoAvailable = false)// 用户不是必须选择允许或拒绝。

				// 临时进行更改：
			await navigator.mediaDevices.getUserMedia({ audio: true })
			// await navigator.mediaDevices.getUserMedia({ audio: {
				// echoCancellation:true,
				// autoGainControl:false,
				// googAutoGainControl:false,
				// noiseSuppression:false

			// } })
				.then(() => this.audioAvailable = true)
				.catch(() => this.audioAvailable = false)

				// getDisplayMedia() 方法提示用户去选择和授权捕获展示的内容或部分内容（如一个窗口）在一个  MediaStream 里
			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ screenAvailable: true })
			} else {
				this.setState({ screenAvailable: false })
			}

			if (this.videoAvailable || this.audioAvailable) {
				navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
					.then((stream) => {
						window.localStream = stream
						this.localVideoref.current.srcObject = stream
					})
					.then((stream) => {
					})
					.catch((e) => console.log(e))
			}
		} catch(error) { console.log(error) }
	}

	getMedia = () => {
		this.setState({
			video: this.videoAvailable,
			audio: this.audioAvailable
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = (props) => {
		if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then(this.getUserMediaSuccess)
				.then((stream) => {
				})
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.localVideoref.current.srcObject.getTracks()//MediaStream 接口的getTracks() 方法会返回一个包含  track set 流中所有 MediaStreamTrack  对象的序列
				tracks.forEach(track => track.stop())
			} catch (e) {}
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			// 直接从localStream中调用
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)
			/* 
			RTCPeerConnection接口的createOffer（）方法启动创建一个SDP offer，目的是启动一个新的WebRTC去连接远程端点。
			SDP offer包含有关已附加到WebRTC会话，浏览器支持的编解码器和选项的所有MediaStreamTracks信息，以及ICE 代理，
			目的是通过信令信道发送给潜在远程端点，以请求连接或更新现有连接的配置。
			*/
			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				// callback
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				// let blackSilence = (...args) => new MediaStream([this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream)
					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
						.then(() => {
							this.flipVideoDirection()
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}
	mergeTracks = (baseStrem, extraStream) => {
    if (!baseStrem.getAudioTracks().length) {
        baseStrem.addTrack(extraStream.getAudioTracks()[0])
        return baseStrem;
    }
    const context = new AudioContext();
    const baseSource = context.createMediaStreamSource(baseStrem);
    const extraSource = context.createMediaStreamSource(extraStream);
    const dest = context.createMediaStreamDestination();

    const baseGain = context.createGain();
    const extraGain = context.createGain();//用户麦克风
    baseGain.gain.value = 0.8;
    extraGain.gain.value = 1;

    baseSource.connect(baseGain).connect(dest);
    extraSource.connect(extraGain).connect(dest);

    return new MediaStream([baseStrem.getVideoTracks()[0], dest.stream.getAudioTracks()[0]]);
}

	// 获得共享屏幕;
	getDisplayMedia = (event) => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				let shareWindowUser=this.shareScreen.current.dataset.user;
				let microAudio;//用户麦克风声音
				// ===========
				navigator.mediaDevices.getUserMedia({
					video: true,
					audio:true,
					// audio: {
					// 	autoGainControl:false,
						// echoCancellation:true,
					// 	googAutoGainControl:false,
					// 	noiseSuppression:false
					// }
			}).then((audioStream)=>{
				
				// var stream = mergeTracks(userStream, audioStream);
				microAudio=audioStream;
				console.log(microAudio.getTracks(), audioStream.getTracks());
			})
					navigator.mediaDevices.getDisplayMedia({ video: true, 
						audio:true
					})
						.then((stream)=>{
							this.getDisplayMediaSuccess(stream,microAudio)
						})
						.then((stream) => {
						})
						.catch((e) => console.log(e))
			}
		}
	}

	getDisplayMediaSuccess = (stream,microAudio) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }
		// console.log(userStream.getTracks(), audioStream.getTracks());
		//  stream = mergeTracks(userStream, audioStream);
		stream=this.mergeTracks(stream, microAudio);
		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
						// this.flipVideoDirection() //同时客户端反转视频方向
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }
				// 使展示界面变黑，并且静音
				// let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				let blackSilence = (...args) => new MediaStream([this.silence()])
				window.localStream = blackSilence()//return了新的stream
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				// 同步新接入的user对应视频解码器
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				/* 
				注册消息处理程序。您的信令服务器还应该有一个来自另一个对等体的消息的处理程序。如果消息包含RTCSessionDescription对象，
				则应使用setRemoteDescription（）方法将其添加到RTCPeerConnection对象。如果消息包含RTCIceCandidate对象，
				则应使用addIceCandidate（）方法将其添加到RTCPeerConnection对象。
				*/
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}
	flipVideoDirection=()=>{
		let main = document.getElementById('main')
		let videos = main.querySelectorAll("video")
		for (let a = 0; a < videos.length; ++a) {
			if(videos[a].dataset.user==this.state.flipVideo){
				// videos[a].style.setProperty('transform',"rotateY(360deg)") 
			} 
		}
	}

	shakeWindow=(e, sender, socketIdSender)=>{
		let dom=document.getElementById(e)
		if (socketIdSender !== socketId && !dom) {
		// 聊天窗口关闭状态
			this.shakeWindow2('mainChat',sender, socketIdSender);
		}
		else if(socketIdSender !== socketId && dom){
			this.shakeWindow2('mainChat',sender, socketIdSender);
		}
		if(!dom){
			return;
		};

		dom.style.setProperty( 'animation',`shake 0.2s infinite`);
		setTimeout(() => {
				dom.style.removeProperty('animation');
		}, 600);

	}
	shakeWindow2=(name,sender, socketIdSender)=>{
	if(! this.state.showModal){
		this.setState({ showModal: true},()=>this.goShake(name,sender, socketIdSender))
	}
	}
	goShake=(name,sender, socketIdSender)=>{
		let dom=document.getElementById('mainChat')
		if(!dom){ return}
		dom.style.setProperty( 'animation',`shake 0.2s infinite`);
		setTimeout(() => {
				dom.style.removeProperty('animation');
		}, 600);
		if (sender == socketId) {
			this.setState({ newmessages: 0 })
		}
		if (socketIdSender == socketId) {
			this.setState({ newmessages: 0 })
		}
	}

	containsShake=(data)=>{
		if(data.indexOf('*shake*')!=-1){
			return true;
		}
		return false;
	}
	


	connectToSocketServer = () => {
		socket = io.connect(server_url, {  path: '/myscoket',secure: true })

		socket.on('signal', this.gotMessageFromServer)
		socket.on('connect', () => {
			socket.emit('join-call', this.props.location.state.roomId)
			socketId = socket.id
			socket.on('chat-message', this.addMessage)
			socket.on("shake",this.shakeWindow)
			socket.on('user-left', (id) => {
				let video = document.querySelector(`[data-socket="${id}"]`)
				// 已删除
				if (video !== null) {
					elms--
					// 清除已退出的用户
					video.parentNode.removeChild(video)

					let main = document.getElementById('main')
					changeCssVideos(main,elms)
				}
			})

			socket.on('user-joined', (id, clients) => {
				clients.forEach((socketListId) => {
					// 新建RTCPeerConnection对象
					connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					// 等待ice候选人, 注册onicecandidate处理程序。它会将任何ICE候选者发送给另一个对等体。      
					connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					// 等待视频流 
					// 注册onaddstream处理程序。一旦从远程对等体收到视频流，就处理视频流的显示。
					connections[socketListId].onaddstream = (event) => {
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { 
							searchVidep.srcObject = event.stream
						} else {
							elms = clients.length//一个用户 或多个用户
							let main = document.getElementById('main')
							let cssMesure = changeCssVideos(main,elms)
							// 新增video
							let video = document.createElement('video')
							video.setAttribute("controls","controls")
							video.setAttribute("poster",poster2)
								
								let css = {minWidth: cssMesure.minWidth, maxHeight:'90%',minHeight: cssMesure.minHeight,
								margin: "10px",marginBottom:'80px',marginTop:'30px',
								borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill"}
								for(let i in css) video.style[i] = css[i]
								// 增加用户，则单人视频界面变窄；
								video.style.setProperty("width", cssMesure.width)
								video.style.setProperty("height", cssMesure.height)

							video.setAttribute('data-socket', socketListId)
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true

							main.appendChild(video)//增加一个新的视频界面
						}
					}

					/* 注释
					RTCPeerConnection.addStream()
          Adds a MediaStream as a local source of video or audio.
					*/
					if (window.localStream !== undefined && window.localStream !== null) {
						// 利用getUserMedia（）设置本地媒体流，并使用addStream（）方法将其添加到RTCPeerConnection对象。
						connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						// let blackSilence = (...args) => new MediaStream([ this.silence()])
						window.localStream = blackSilence()
						connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socketId) {
					for (let id2 in connections) {
						if (id2 === socketId) continue
						
						try {
							connections[id2].addStream(window.localStream)
						} catch(e) {}
						/* 
						开始提供/回答谈判过程。这是呼叫者流程与受访者不同的唯一步骤。调用者使用createOffer（）方法开始协商，
						并注册接收RTCSessionDescription对象的回调。那么这个回调应该使用setLocalDescription（）
						将这个RTCSessionDescription对象添加到你的RTCPeerConnection对象。
						*/
						connections[id2].createOffer().then((description) => {
							connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}
// 静音
	silence = () => {
		// audio只能用来控制音频的各种行为，比如播放、暂停、音量大小等等
		// 想要控制音频更「高级」的属性，比如声道的合并与分割、混响、音调、声相控制和音频振幅压缩等等
		// 就需要使用audioContext;
		let ctx = new AudioContext()
		// createOscillator会创建一个OscillatorNode，该节点表示周期波形。 它基本上会产生恒定的音调。
		let oscillator = ctx.createOscillator()
		/* 
		createMediaStreamDestination()方法用于创建与表示音频流的WebRTC MediaStream相关联的新MediaStreamAudioDestinationNode对象，
		该对象可以存储在本地文件中，也可以发送到另一台计算机。

		AudioNode接口的connect（）方法使您可以将节点的输出之一连接到目标，该目标可以是另一个AudioNode
		（从而将声音数据定向到指定的节点）或AudioParam，以便节点的输出数据自动 用于随时间更改该参数的值。
		*/
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		// AudioBufferSourceNode接口的start（）方法用于安排缓冲区中包含的音频数据的播放，或立即开始播放。
		oscillator.start()
		// AudioContext接口的resume（）方法在以前已暂停的音频上下文中恢复时间的进展。
		ctx.resume()
		// 临时测试用
		dst.stream.getAudioTracks()[0].applyConstraints({echoCancellation: false});
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}

	// 黑屏
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		const ctx=canvas.getContext('2d')
		canvas.getContext('2d').fillRect(0, 0, width, height)
		canvas.getContext('2d').fillStyle="#000"
		// ctx.drawImage(poster2,0,0);
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}
	// 几个toggle处理
	handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handleAudio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
	handleScreen = (e) => {
		this.setState({ screen: !this.state.screen }, (e) => this.getDisplayMedia(e))
	}

	// 结束视频
	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) {}
		window.location.href = "/"
	}
	// 截图
	saveScreen=()=>{
		// const screen = document.getElementsByClassName("root")[0];
		const screen = document.querySelectorAll("video");
		console.log(screen)
		let update=[];
		const that=this
		for(let item of screen){
			const canvas = videoCanvas(item);
			// const canvasM=this.mirrorImage(canvas,)
			const imgUrl = canvas.toDataURL('image/png');
			update.push(imgUrl)
		}
		this.setState({
			screenData:update
		},()=>{
			console.log(this.state.screenData.length)
			this.setState({screenVisible:true});
		})
    // html2canvas(screen).then(canvas => {
			// const imgUrl = canvas.toDataURL('image/png');
    // }).catch((err)=>{console.log(err)})
	}
	 mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false){
    ctx.save();  // save the current canvas state
    ctx.setTransform(
        horizontal ? -1 : 1, 0, // set the direction of x axis
        0, vertical ? -1 : 1,   // set the direction of y axis
        x + (horizontal ? image.width : 0), // set the x origin
        y + (vertical ? image.height : 0)   // set the y origin
    );
    return ctx.drawImage(image,0,0);
    ctx.restore(); // restore the state as it was when this function was called
}

	// 截图控制
	handleOk = e => {this.setState({screenVisible: false,screenData:[]})};
  handleCancel = e => {this.setState({screenVisible: false,screenData:[]})};

	// 对话框发送消息;
	openChat = () => this.setState({ showModal: true, newmessages: 0 })
	closeChat = () => this.setState({ showModal: false })
	handleMessage = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socketIdSender) => {
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data }],
		}))
		if (socketIdSender !== socketId) {
			this.setState({ newmessages: this.state.newmessages + 1 })
		}
	}

	handleUsername = (e) => this.setState({ username: e.target.value })

	sendMessage = () => {
		socket.emit('chat-message', this.state.message, this.state.username)
		this.setState({ message: "", sender: this.state.username })
	}
	sendShake=(dom)=>{
		socket.emit('shake',dom,this.state.username)
	}
	// 一键复制url
	copyUrl = () => {
		let text = `Room:${this.props.location.state.roomId} Password:${this.props.location.state.password}`
		// 区分浏览器
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}

	connect = () => this.setState({ askForUsername: false }, () => this.getMedia())
	// 测试是否为chrome
	isChrome = function () {
		let userAgent = (navigator && (navigator.userAgent || '')).toLowerCase()
		let vendor = (navigator && (navigator.vendor || '')).toLowerCase()
		let matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
		// let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
		// return matchChrome !== null || matchFirefox !== null
		console.log(matchChrome)
		return matchChrome !== null
	}

	updateFileList=(file)=>{
		this.setState({	fileList: [...this.state.fileList, ...file.fileList]},()=>{
			let temp=file.fileList[0].originFileObj
			let imageBase64=getBase64(temp)
			imageBase64.then((res)=>{

				socket.emit('chat-message', res, this.state.username)
				this.setState({ message: "", sender: this.state.username })
				this.setState({ fileList: []})
			})
		});
	}
	checkShake=(data,sender, socketIdSender)=>{
			 return (<MessageBox >
				 <p style={{ wordBreak: "break-all" }}>{data}</p>
				 </MessageBox>
			 )
	}
	checkShakeLeft=(data,sender, socketIdSender)=>{
			 return (<MessageBoxLeft >
				 <p style={{ wordBreak: "break-all" }}>{data}</p>
				 </MessageBoxLeft>
			 )
	}
	fileTypeCheck=(file)=>{
let index=file.name.lastIndexOf(".")
let _fileName=file.name.substr(index+1);
			if (_fileName == 'png' ||
			_fileName == 'jpg'   ||
			_fileName == 'jpeg'  
			) {
				message.loading({
					content:`Upload Successfully, Loading...`,
					style: {
						zIndex: '9999',
						marginTop:'85vh'
					},
					duration:1
			});
				return true;
			}else{
				this.setState({ fileList: []})
				return false;
			}
	}

	imagProps={
		action:'',
		beforeUpload: file => {
		return false;
		},
		onChange: file => {
		// console.log(file)
			 let flag=this.fileTypeCheck(file.file);
			if(flag===false){
				message.error({
					content:`${file.file.name} is not a valid file`,
					style: {
						zIndex: '9999',
						marginTop:'85vh'
					},
					duration:1
				});
				this.setState({ fileList: []})
				return;
			}
			else{
				this.updateFileList(file);
			}
			return true;

		},
		progress: {
			strokeColor: {
				'0%': '#108ee9',
				'100%': '#87d068',
			},
			strokeWidth: 3,
			format: percent => `${parseFloat(percent.toFixed(2))}%`,
		},

		
	}
	render() {
		if(this.isChrome() === false){
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
		return (
		<Fragment >
			<GlobalStyle></GlobalStyle>
			<div  className="screenShot">
				{this.state.askForUsername === true ?
					<div>
						<div style={{background: "white",borderRadius:'20px', width: "92%", height: "auto", padding: "20px",
								textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"}}>
							<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>Username</p>
							<Input 
							style={{width:'40%'}}
							 placeholder="Username" value={this.state.username} onChange={e => this.handleUsername(e)} />
							<ButtonAnt type="primary" onClick={this.connect} style={{ margin: "20px" }}>Connect</ButtonAnt>
						</div>
						<div style={{ justifyContent: "center", textAlign: "center", paddingTop: "40px" }}>
							<VideoBox 
							// id="my-video123123"
							// poster={poster2}
							className="initialVideo"
							controls
							onclick={(e)=>toggleVideoSize(e)}
							data-user={this.state.username} ref={this.localVideoref} autoPlay muted ></VideoBox>
						</div>
					</div>
					:
					<div>
						<IconList  style={{ backgroundColor: "whitesmoke", color: "whitesmoke", textAlign: "center" }}>

							<IconButton style={{ color: "#f44336" }} onClick={this.handleEndCall}>
								<CallEndIcon />
							</IconButton>
							<IconButton style={{  }} onClick={()=>{this.saveScreen()}} >
							<CameraOutlined />
							</IconButton>
				<AntModal
        title="ScreenShot"
        centered
        visible={this.state.screenVisible}
				okText="ok"
				cancelText="close"
        onOk={() =>this.handleOk()}
        onCancel={() =>this.handleCancel()}
        width={1050}
      >
<div>
{
					this.state.screenData.length!==0 ?
					this.state.screenData.map((item,index)=>{
					return (
						<Image
						key={index}
					style={{marginRight:'30px',}}
					height={350}
					width={300}
					src={item}
					alt="video screenshot"
					      fallback="data:image/png;base64,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"
					></Image>
					)})
					:
					null
				}
</div>
      </AntModal>
							<IconButton style={{ color: "#424242" }} onClick={this.handleVideo}>
								{(this.state.video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
							</IconButton>

							<IconButton style={{ color: "#424242" }} onClick={this.handleAudio}>
								{this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
							</IconButton>

							{/* 共享屏幕 */}
							{this.state.screenAvailable === true ?
								<IconButton
								 ref={this.shareScreen}
								 data-user={this.state.username} 
								 style={{ color: "#424242" }} onClick={(e)=>{this.handleScreen(e)}}>
									{this.state.screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
								</IconButton>
								: null}

							<Badge badgeContent={this.state.newmessages} max={999} color="secondary" onClick={this.openChat}>
								<IconButton style={{ color: "#424242" }} onClick={this.openChat}>
									<ChatIcon />
								</IconButton>
							</Badge>
						</IconList>
						{/* 聊天室 */}
						<Modal id="mainChat" show={this.state.showModal} onHide={this.closeChat} style={{ height:'90%' }}>
							<Modal.Header closeButton>
								<Modal.Title style={{marginLeft:'40%'}}>iMessage</Modal.Title>
							</Modal.Header>
							<Modal.Body  id="messageBody" style={{ overflow: "auto", overflowY: "auto", height: "60vh",width:'100%', textAlign: "left" ,
							background:`url(${chatWallPaper}) repeat-Y top`,
						
							}}
							 >
								{this.state.messages.length > 0 
								? 
								this.state.messages.map((item, index) => {
							  {scrollToBottom()}
								return (
									this.state.username===item.sender)
									?
							    (
									<UserContainer key={`${index}--${item.sender}`}>
									<Sender >
									<div>
									<img src={icon1}
									style={{width:'35px',height:'35px', borderRadius:'50%'}}
									 alt="uer icon"/>
									 </div>
									
									</Sender>
									{checkMessage(item.data)
									?
									(
										<ImageBox>
										<Image src={item.data}/>
										</ImageBox>
									)
									:
									this.checkShake(item.data)
									}
										
									</UserContainer>
									)
									:
								  (
										<UserContainer key={`${index}--${item.sender}`}>	
									<SenderLeft >
									<div>
									<img src={icon2}
									style={{width:'35px',height:'35px',borderRadius:'50%'}}
									 alt="uer icon"/>
									 </div>
									</SenderLeft>
									
									{checkMessage(item.data) 
									?
									<ImageBoxLeft>
									<Image src={item.data}/>
									</ImageBoxLeft>
									:
									this.checkShakeLeft(item.data)
									}
									</UserContainer>
									)
								}) 
								: 
								<p style={{textAlign:'center'}}>---No messages history---</p>}
							</Modal.Body>
							<Modal.Footer className="div-send-msg">
								
								<Upload 
							{...this.imagProps}
							fileList={this.state.fileList}
							>
									<ButtonAnt style={{backgroundColor:'#146c89'}} type="primary" icon={<UploadOutlined />}>Image</ButtonAnt>
							</Upload>
							<ShakeOutlined onClick={()=>{ 
								this.sendShake('mainChat');
							}}
								 />
								
							<div style={{width:'100%'}}>
							<Input placeholder="Message" value={this.state.message} 
								style={{width:'60%'}}
								onPressEnter={this.sendMessage}
								onChange={e => this.handleMessage(e)} />
								<ButtonAnt  type="primary" onClick={this.sendMessage}>Send</ButtonAnt>
							</div>
							</Modal.Footer>
						</Modal>
						<MessageContainer >
							<div style={{ paddingTop: "20px" }}>
								<Input 
								value={`Room:${this.props.location.state.roomId} Password:${this.props.location.state.originalP}`} 
								style={{color:'black',width:'40%'}} 
							// 
								></Input>
								<ButtonAnt type="primary" style={{backgroundColor: "#3f51b5",color: "whitesmoke",marginLeft: "20px",
									marginTop: "10px",width: "120px",fontSize: "10px"
								}} onClick={this.copyUrl}>Copy Room Info</ButtonAnt>
							</div>

							<Row id="main" style={{margin:'0px',padding:'0px'}} className="flex-container" >
								<VideoBox id="my-video"
								style={{borderRadius:'20px',height:'100%'}}
								controls
								poster={poster2}
								 data-user={this.state.username} ref={this.localVideoref} autoPlay muted ></VideoBox>
							</Row>
						</MessageContainer>
					</div>
				}
			</div>
		</Fragment>
		)
	}
}

export default withRouter(Video)