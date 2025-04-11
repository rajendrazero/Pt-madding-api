import { prisma } from '../utils/prismaClient'

export const createRating = async (userId: string, itemId: string, rating: number) => {
  const existing = await prisma.rating.findUnique({ where: { userId_itemId: { userId, itemId } } })
  if (existing) {
    return await prisma.rating.update({
      where: { userId_itemId: { userId, itemId } },
      data: { rating }
    })
  }
  return await prisma.rating.create({
    data: {
      userId,
      itemId,
      rating
    }
  })
}