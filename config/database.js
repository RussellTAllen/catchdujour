const mongoose = require('mongoose')

function getDatabaseUri(){
  console.log('node env: '+process.env.NODE_ENV)
  return (process.env.NODE_ENV === "dev")
    ? process.env.DEV_DB_STRING
    : process.env.DB_STRING
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(getDatabaseUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
