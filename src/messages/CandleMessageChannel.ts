import { Channel, connect } from "amqplib"

import { Server } from "socket.io"
import * as http from 'http'
import CandleController from "../controllers/CandleController"
import { Candle } from "../models/CandleModel"



export default class CandleMessageChannel {

    private _channel: Channel
    private _candleCtrl: CandleController
    private _io: Server

    constructor(server: http.Server) {
        this._candleCtrl = new CandleController()
        this._io = new Server(server, {
            cors: {
                origin: 'http://localhost:8080',
                methods: ["GET", "POST"]
            }
        })
        this._io.on('connection', () => console.log('Web socket connection created'))
    }

    private async _createMessageChanel() {
        try {
            const connection = await connect("amqp://guest:guest@localhost:5672")
            this._channel = await connection.createChannel()
            this._channel.assertQueue('candles')
        } catch (err) {
            console.log('Connection to RabbitMQ failed')
            console.log(err)
        }
    }

    async consumeMessages() {
        await this._createMessageChanel()
        if (this._channel) {
            console.log(this._channel);
            this._channel.consume('candles', async msg => {
                const candleObj = JSON.parse(msg.content.toString())
                console.log('Message received')
                console.log(candleObj)
                this._channel.ack(msg)

                const candle: Candle = candleObj
                await this._candleCtrl.save(candle)
                console.log('Candle saved to database')
                this._io.emit('newCandle', candle)
                console.log('New candle emited by web socket')
            })

            console.log('Candle consumer started')
        }
    }
}