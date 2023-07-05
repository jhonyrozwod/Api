import { connection } from 'mongoose'
import { app } from './app'
import { connectToMongoDB } from './config/db'
import CandleMessageChannel from './messages/CandleMessageChannel'

const createServer = async () => { 
await connectToMongoDB()
const PORT = 3000
const server = app.listen(PORT, () => console.log('app rodando'))
    
    const candleMsgChannel = new CandleMessageChannel(server)
    
    candleMsgChannel.consumeMessages()
   
    process.on('SIGINT', async () => { 
        await connection.close()
        server.close()
        console.log('app server e mongo closed');

    })
}



createServer()

