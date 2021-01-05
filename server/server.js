const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const { Users } = require("./utils/users");
const { emit } = require('process');
const publicPath = path.join(__dirname, '/../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
let users = new Users()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('a user connected')
    
    socket.on('join', (params, callback) => {
      if(!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and Room are required')
      }

      socket.join(params.room)
      users.removeUser(socket.id)
      users.addUser(socket.id, params.name, params.room)

      io.to(params.room).emit("updateUsersList", users.getUserList(params.room))

      socket.emit(
        "newMessage",
        generateMessage("Admin", "Welcome to the chat app")
      );

      socket.broadcast.emit(
        "newMessage",
        generateMessage("Admin", "New user joined")
      );

      callback()
    })

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id)
        if(user && isRealString(message.text)) {
          io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))
          callback('This is the server')
        }
    })

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id)
        if(user) {
          io.to(user.room).emit(
            "newLocationMessage",
            generateLocationMessage(user.name, coords.lat, coords.long)
          )
        }
    })

    socket.on("disconnect", () => {
      let user = users.removeUser(socket.id)
      if(user) {
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} chat room`))
      }
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})