import { Router } from 'express'

export const rootRoute = Router()

rootRoute.get('/', (req, res) => {
  res.status(200).send('Hello world')
})
