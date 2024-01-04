import mongoose from 'mongoose'

let isConnected = false //track connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true) //get rid of console warnings
    if(isConnected){
        console.log('Already connected to mongoDB')
        return
    }

    console.log("connecting to DB")
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: "blogsite",
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        isConnected = true
        console.log("Successfully connected to mongoDB")
    } catch (error) {
        console.log(error)
    }
}