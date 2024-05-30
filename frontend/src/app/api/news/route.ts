import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

import News from '@/model/News'
import { Collection, MongoClient } from 'mongodb'

const mongodbConnStr = process.env.MONGODB_URI

export async function GET(req: Request, res: NextApiResponse) {
  if (!!!mongodbConnStr) {
    throw new Error('MongoDB connection URI is missing in the environment')
  }
  const client = new MongoClient(mongodbConnStr)

  try {
    await client.connect()
    const stocksNews: Collection = client.db('news_database').collection('stocks_news')
    const news = (await stocksNews
      .find({ published: { $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } })
      .toArray()) as News[]

    return NextResponse.json(
      {
        news,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error occurred when querying mongodb: ', error)
    return NextResponse.json(
      { message: 'Error occurred when querying mongodb' },
      {
        status: 503,
      }
    )
  } finally {
    await client.close()
  }
}

export const dynamic = 'force-dynamic'
