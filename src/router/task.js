const express = require('express')
const router = new express.Router()
const Task = require('../model/task.js')
require('../db/mongoose.js')
const auth = require('../middleware/auth')


router.post('/tasks',auth, async (req, res) => {
    //console.log(req.body)
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})



router.get('/tasks',auth, async (req, res) => {
const match = {}
const sort = {}
if(req.query.sortby) {
    const parts = req.query.sortby.split(':')
    sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
}

if(req.query.completed) {
    match.completed = req.query.completed ==='true'
}

    try {
       // const tasks = await Task.find({owner: req.user._id})
       await req.user.populate({
           path: 'tasks',
           match,
           options: {
               limit : parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
           }
       }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "Invalid update" })
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        //const task = await Task.findById(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router