'use client'

import { Fragment, use, useEffect, useState } from 'react'
import React from 'react'

import Link from 'next/link'

import News from '@/model/News'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { format, parseISO } from 'date-fns'

import styles from './page.module.scss'

const stockSymbol = [
  { name: 'NASDAQ', symbol: '^IXIC' },
  { name: 'S&P500', symbol: '^GSPC' },
]

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [marketPrice, setMarketPrice] = useState<{ name: string; price: number }[]>([])
  const [emotionScore, setEmotionScore] = useState(82)

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then(({ news }: { news: News[] }) => {
        setNews(news.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()).slice(0, 10))
      })
  }, [])

  useEffect(() => {
    const prices: { name: string; price: number }[] = []
    stockSymbol.map(({ name, symbol }) => {
      fetch(`/api/market/price?symbol=${symbol}`)
        .then((res) => res.json())
        .then(({ price }: { price: number }) => {
          prices.push({ name, price })
          setMarketPrice(prices)
        })
    })
  }, [])

  useEffect(() => {
    console.log(marketPrice)
  }, [marketPrice])

  useEffect(() => {
    if (!(news?.length > 0)) {
      setEmotionScore(0)
    }

    setEmotionScore((news.filter((item) => item.emotion === 'Positive').length / news.length) * 100)
  }, [news])

  return news?.length > 0 ? (
    <Grid container spacing={2} className={styles.main}>
      <Grid xs={12}>
        <Box sx={{ width: '100%', textAlign: 'center', fontSize: '2.5rem' }} padding={'10rem 0 5rem'}>
          <Typography
            variant="h4"
            style={{ color: emotionScore > 80 ? '#52b202' : emotionScore > 50 ? '#F6EEC9' : '#EE4E4E' }}
            gutterBottom
          >
            Today's market emotion
          </Typography>
          <Gauge
            value={emotionScore}
            startAngle={-110}
            endAngle={110}
            sx={{
              margin: '2em 0',
              height: '10rem',
              [`& .${gaugeClasses.valueArc}`]: {
                fill: emotionScore > 80 ? '#52b202' : emotionScore > 50 ? '#F6EEC9' : '#EE4E4E',
              },
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: '2rem',
                transform: 'translate(0px, 0px)',
              },
            }}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
          />
        </Box>
      </Grid>
      {marketPrice.map(({ name, price }, index) => (
        <Grid xs={6} key={index}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {name}
              </Typography>
              <Typography variant="h5" component="div">
                {price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid xs={12}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {news?.map(({ title, link, published, emotion }, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {emotion == 'Positive' ? (
                    <SentimentVerySatisfiedIcon fontSize="large" sx={{ color: '#52b202' }} />
                  ) : emotion == 'Negative' ? (
                    <SentimentVeryDissatisfiedIcon fontSize="large" sx={{ color: '#EE4E4E' }} />
                  ) : (
                    <SentimentNeutralIcon fontSize="large" sx={{ color: '#F6EEC9' }} />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Link href={link}>
                      <Typography sx={{ display: 'inline' }} component="span" variant="h5" color="text.primary">
                        {title}
                      </Typography>
                    </Link>
                  }
                  secondary={
                    <>
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {`${format(parseISO(published), 'dd-MM-yyyy HH:mm')} - ${new URL(link).hostname}`}
                      </Typography>
                    </>
                  }
                />

                <IconButton aria-label="thumb-up">
                  <ThumbUpIcon />
                </IconButton>
                <IconButton aria-label="thumb-down">
                  <ThumbDownIcon />
                </IconButton>
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  ) : (
    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ width: 1, height: '100vh' }}>
      <CircularProgress sx={{ color: 'white' }} />
    </Stack>
  )
}
