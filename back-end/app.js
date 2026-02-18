require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to serve About Us page content as JSON
app.get('/about', (req, res) => {
  res.json({
    paragraphs: [
      "Hi, I'm Antonio. I'm a senior at NYU double majoring in computer science and math, with minors in history and Spanish. I chose CS and math mainly because they're solid, practical degrees and I like problem-solving—figuring out how things work, breaking problems down, and building solutions that actually do something. History is more of a personal interest and something I genuinely enjoy studying, and Spanish came from wanting to improve my language skills, stay connected to my background, and learn more about different cultures. I also studied abroad for a semester at NYU Madrid, which helped push my Spanish and gave me a different perspective outside the U.S.",
      "Outside of classes, I work full-time as a software engineer at a sports AI startup--RotoBot AI. I've worked across the full stack, but most of my focus is on backend and data work. I like working on systems, pipelines, and the parts of a product that keep everything running smoothly. Most of my time is split between school, work, training, and side projects, and I'm pretty focused on building skills and setting myself up well after graduation.",
      "With my free time, I like to keep things pretty balanced. I enjoy reading, and right now I'm reading The Correspondent by Virginia Evans (honestly a 10/10, highly recommend). My favorite book is East of Eden by John Steinbeck, which is also a 10/10 and one of those books everyone should read at least once. I also spend a lot of time in the gym—lifting, running, and training MMA. I compete a couple of times a year, which keeps me disciplined and gives me something concrete to work toward. Lately, I've also been experimenting more with cooking and trying new recipes—some turn out great, some… not so much (chicken does NOT belong in brownies).",
    ],
    imageUrl: 'https://drive.google.com/thumbnail?id=1evHLNhlxrrPpomEN5JPRqjVXq-871O2q&sz=w400',
  })
})

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
