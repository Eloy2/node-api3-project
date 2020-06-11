const express = require("express")
const logger = require("./middleware/logger")
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")
// require('dotenv').config() 
// commented out the above line because I am initiating it in package.json

const server = express()
const port = process.env.PORT

server.use(express.json())
server.use(logger())
server.use(userRouter)
server.use(postRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})