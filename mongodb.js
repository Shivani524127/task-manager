const {MongoClient, ObjectID }= require('mongodb')

const dbName = 'task-manager'

MongoClient.connect(process.env.MONGODB_CONNECTION_URL, {useNewUrlParser: true}, (error,client)=> {
    if(error) {
       return console.log('Unable to connect to database')
    } 
    const db = client.db(dbName)
    // db.collection('users').insertOne({
    //     name:'Shivani',
    //     age:23
    // },(error, result) => {
    //     if(error) {
    //         return console.log('unable to insert user')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([ {
    //     name:'Shivu',
    //     age:23
    // },{
    //     name:'Shivi',
    //     age:22
    // }],(error, result) => {
    //     if(error) {
    //         return console.log('unable to insert user')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description:"meeting",
    //         completed:true
    //     }, {
    //         description: "breakfast",
    //         completed:true
    //     }, {
    //         description:"task 3",
    //         completed:false
    //     }
    // ], (error, result) => {
    //     if(error) {
    //         return console.log("unable to insert tasks")
    //     }

    //     console.log(result.ops)
    // })

    db.collection('users').find({age:22}).toArray((error,user) => {
        console.log(user)
    })

    db.collection('tasks').findOne({
        _id: new ObjectID('5e7dc98c347bdb0930ad0971')
    }, (error, task) => {
        console.log(task)
    })

    db.collection('tasks').find({ completed: true
    }).toArray((error,tasks) => {
        console.log(tasks)
    })

//    db.collection('users').updateOne({
//         _id:new ObjectID("5e7dc6e5bcd3ab4a14024777")
//     }, {
//         $set: {
//             name: 'Shivani Agrawal'
//         }
//     }).then((result) => {
//         console.log(result)
//     }).catch((error) => {
//         console.log(error)
//     })

    // db.collection('tasks').updateMany({
    //     completed:false
    // }, {
    //     $set: {
    //         completed:true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age: 22
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    db.collection('tasks').deleteOne({
        description:'task 3'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })




})
