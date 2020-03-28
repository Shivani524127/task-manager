const express = require('express')
const Task = require('./model/task.js')


const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express()

// app.use((req,res,next) => {
//     res.status(503).send({error: "service unavailable"})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
const port = process.env.PORT




app.listen(port, () => {
    console.log('server is running on port ' + port)
})  