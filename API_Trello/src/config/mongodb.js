import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
//Kết nối DB
export const CONNECT_DB = async () => {
  console.log('🔗 Connecting to MongoDB:', env.MONGODB_URI)
  // console.log(process.env.AUTHOR)
  //Gọi kết nối tới mongo Atlas
  await mongoClientInstance.connect()
  //Lấy ra database
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}
export const CLOSE_DB = async () => {
  console.log('code chạy vào chỗ close')
  await mongoClientInstance.close()
}
//Lấy ra DB đã kết nối
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first!')
  return trelloDatabaseInstance
}
