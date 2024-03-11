const mongoose = require('mongoose')

const connectDB =  async() => {
  return mongoose.connect('mongodb+srv://leo:qwertopop11@cluster0.rr8lbpm.mongodb.net/url').then(() => {
      console.log('Connected to database.')
  }
  ).catch(err => {
      console.log('Could not connect to database.')
      console.log(err)
  })
}
module.exports = {connectDB}
