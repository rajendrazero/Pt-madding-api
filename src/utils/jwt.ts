import jwt from 'jsonwebtoken'

export const generateToken = (user: { id: string, role: string }) => {
  return jwt.sign(user, process.env.SECRET!, { expiresIn: '7d' })
}