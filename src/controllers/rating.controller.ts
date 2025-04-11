import { Request, Response } from 'express'
import * as ratingService from '../services/rating.service'

export const createRating = async (req: Request, res: Response) => {
  const { itemId, rating } = req.body
  const userId = req.body.user.id // dari middleware auth
  const result = await ratingService.createRating(userId, itemId, rating)
  res.json(result)
}