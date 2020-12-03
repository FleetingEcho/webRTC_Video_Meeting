const express = require('express')
const http = require('http')
const cors = require('cors')
const logSymbols = require('log-symbols');
const app = express()
// const bodyParser = require('body-parser')
const path = require("path")
const xss = require("xss")
const helmet = require('helmet');
const server = http.createServer(app)
const {connector}=require('./db')
const {iconList}=require('./iconList')
const io = require('socket.io')(server,{path:'/mysocket'})
// const io = require('socket.io')(server)
const indexRouter=require('./router')
const compression=require('compression')
// const history = require('connect-history-api-fallback');
// 解决跨域问题， 但如果带cookie就得另外配置
app.use(compression())
app.use(cors({
  origin: '*', //Or some origins you can specify
  optionsSuccessStatus: 200
}));
// app.use(history({
// 	index:'/'
// }))
app.use(express.static(path.join(__dirname,"build")))
app.use(express.static(path.join(__dirname,"Error")))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(helmet());
// app.use(cors())
app.use(indexRouter);
// if(process.env.NODE_ENV==='production'){
// 	app.use(express.static(__dirname+"/build"))
// 	app.get("*", (req, res) => {
// 		res.sendFile(path.join(__dirname+"/build/index.html"))
// 	})
// }
app.set('port', (process.env.PORT || 8080))
app.get('/',(req,res)=>{
	// res.sendFile(path.join(__dirname,"build","index.html"))
})
app.get("*",(req,res)=>{
	res.sendFile(path.join(__dirname,"Error","error.html"))
})
const filterString = (str) => {
	return xss(str)
}
const ROOM_NOT_EXIST=1005;
var connections = {}
var messages = {}
var timeOnline = {}
/* 
{
	room:{
		a：1，
		b:2
	}
}
*/
io.on('connection', (socket) => {

	socket.on('join-call', (path,userIcon) => {
		console.log('path is '+path)
		if(connections[path] === undefined){
			connections[path] = []
		}
		connections[path].push(socket.id)
		// add icon
		iconList.addIcon(path,userIcon,socket.id);
		console.log(iconList.listAll())

		timeOnline[socket.id] = new Date()

		for(let a = 0; a < connections[path].length; ++a){
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path],userIcon)
		}

		if(messages[path] !== undefined){
			for(let a = 0; a < messages[path].length; ++a){
				io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
					messages[path][a]['sender'], messages[path][a]['socket-id-sender'],messages[path][a]['icon'])
			}
		}

		console.log(path, connections[path])
	})

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('chat-message', (data, sender,icon) => {
		data = filterString(data)
		sender = filterString(sender)

		let key
		let ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id, "icon":icon})
			// console.log("message", key, ":", sender, data)
			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("chat-message", data, sender, socket.id,icon)
			}
		}
	})
	socket.on('shake',(e,sender)=>{
		sender = filterString(sender)
		let key
		let ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			// console.log("message", key, ":", sender, data)
			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("shake", e, sender, socket.id)
			}
		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						io.to(connections[key][a]).emit("user-left", socket.id)
					}
			
					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					console.log(logSymbols.info,key, socket.id, Math.ceil(diffTime / 1000))
					// important;
					connector.leaveRoom(key);
					iconList.delIcon(key,socket.id);
					console.log(111 + key + socket.id);
					if(connections[key].length === 0){
						delete connections[key]
						delete messages[key]
					}
				}
			}
		}
	})
})

server.listen(app.get('port'), () => {
	console.log(logSymbols.success,"listening on", app.get('port'))
})