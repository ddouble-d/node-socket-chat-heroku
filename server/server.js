const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const publicPath = path.join(__dirname, '/../public')
const PORT = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('a user connected')
    
    socket.on('join', (params, callback) => {
      if(!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and Room are required')
      }

      socket.join(params.room)

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
        console.log("createMessage", message)
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback('This is the server')
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit(
          "newLocationMessage",
          generateLocationMessage("Admin", coords.lat, coords.long)
        );
    })

    socket.on("disconnect", () => {
      console.log("user was disconnected");
    });
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})