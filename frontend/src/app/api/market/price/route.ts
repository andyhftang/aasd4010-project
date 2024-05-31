import type { NextApiRequest, NextApiResponse } from 'next'
import { type NextRequest, NextResponse } from 'next/server'

import { getLatestPrice } from '@/app/service/stock-price'

export async function GET(req: NextRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')

  if (!symbol || typeof symbol !== 'string') {
    return NextResponse.json(
      {
        error: 'Invalid or missing symbol parameter',
      },
      {
        status: 400,
      }
    )
  }

  try {
    const price = await getLatestPrice(symbol)
    if (price !== undefined) {
      return NextResponse.json(
        {
          symbol,
          price,
        },
        {
          status: 200,
        }
      )
    } else {
      return NextResponse.json(
        {
          error: 'Failed to fetch the price',
        },
        {
          status: 500,
        }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'An error occurred while fetching the price',
      },
      {
        status: 500,
      }
    )
  }
}
