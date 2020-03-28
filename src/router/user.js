const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const User = require('../model/user.js')
require('../db/mongoose.js')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../email/account')
const multer = require('multer')
const upload = multer({
    limits : {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png file'))
        }

        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/users/logout/all', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save();
        res.send()
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/users/me',auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: "Invalid update" })
    }

    try {

       // const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'),  async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({
        height:250,
        width: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth, upload.single('avatar'),  async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user =await  User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error("hi")
        }
        res.set('Content-type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
    
})


module.exports = router