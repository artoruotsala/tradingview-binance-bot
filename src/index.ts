import express from 'express'
import dotenv from 'dotenv'
import router from './routes/new-order'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(router)

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`)
})
