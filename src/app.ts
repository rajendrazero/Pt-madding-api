import express from 'express'
import itemRoutes from './routes/item.route'
import ratingRoutes from './routes/rating.route'
import commentRoutes from './routes/comment.route'

const app = express()
app.use(express.json())

app.use('/api/items', itemRoutes)
app.use('/api/ratings', ratingRoutes)
app.use('/api/comments', commentRoutes)

export default app