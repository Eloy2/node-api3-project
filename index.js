const express = require("express")
const logger = require("./middleware/logger")
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")

const server = express()
const port = 5000

server.use(express.json())
server.use(logger())
server.use(userRouter)
server.use(postRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})