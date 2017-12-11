import { Server } from '../index'

// const port = process.env.PORT || 3001;
const app = Server.bootstrap()
app.start(8080)
