import { connect } from 'mongoose'


export const connectToMongoDB = async () => {
    await connect('mongodb+srv://jhonathanrozwod:UGkAshUKZWGEcOu7@cluster0.bntsybc.mongodb.net/')
}