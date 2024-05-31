import yahooFinance from 'yahoo-finance2'

export async function getLatestPrice(symbol: string): Promise<number | undefined> {
  try {
    const quote = await yahooFinance.quote(symbol)
    if (quote && quote.regularMarketPrice) {
      const price = quote.regularMarketPrice
      console.log(`The latest price for ${symbol} is: ${price}`)
      return price
    } else {
      console.error('Invalid data format received:', quote)
    }
  } catch (error) {
    console.error('Error fetching price:', error)
  }
}
