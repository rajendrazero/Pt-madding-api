import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token tidak ada' })

  try {
    const payload = jwt.verify(token, process.env.SECRET!)
    req.body.user = payload // Tambah user ke body
    next()
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid' })
  }
}