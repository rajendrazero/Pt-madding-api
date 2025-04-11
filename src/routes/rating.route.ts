import express from 'express'
import * as ratingController from '../controllers/rating.controller'
import { authenticate } from '../middlewares/auth.middleware'

const router = express.Router()
router.post('/', authenticate, ratingController.createRating)

export default router