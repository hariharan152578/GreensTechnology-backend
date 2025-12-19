import express from "express"
import userRoutes from "../src/routes/user.routes"
import { errorHandler } from "../src/middlewares/error.middleware"

const app = express()

app.use(express.json())
app.use("/api/users", userRoutes)

app.use(errorHandler)

export default app
