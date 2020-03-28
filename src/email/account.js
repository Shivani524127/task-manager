const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'shivani.ag996@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the Task-manager app. ${name}, let me know how you get along with the app`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'shivani.ag996@gmail.com',
        subject:'Good Bye!!',
        text:`Thanks for using our app ${name}, please share your feedback`
    })
}

module.exports = {
    sendWelcomeEmail, 
    sendCancellationEmail
}
