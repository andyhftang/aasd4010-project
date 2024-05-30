'use client'

import { Fragment, useEffect, useState } from 'react'

import News from '@/model/News'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import {
  Box,
  CircularProgress,
  Divider,
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

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [emotionScore, setEmotionScore] = useState(82)

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then(({ news }: { news: News[] }) => {
        setNews(news)
      })
  }, [])

  return news?.length > 0 ? (
    <Grid container spacing={2} className={styles.main}>
      <Grid xs={12}>
        <Box sx={{ width: '100%', textAlign: 'center', fontSize: '2.5rem' }} padding={'10rem 0 5rem'}>
          <>Is today a good day for buying stocks?</>
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
      <Grid xs={12}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {news?.map(({ title, link, published, emotion }, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  {emotion == 'positive' ? (
                    <SentimentVerySatisfiedIcon fontSize="large" sx={{ color: '#52b202' }} />
                  ) : emotion == 'negative' ? (
                    <SentimentVeryDissatisfiedIcon fontSize="large" sx={{ color: '#EE4E4E' }} />
                  ) : (
                    <SentimentNeutralIcon fontSize="large" sx={{ color: '#F6EEC9' }} />
                  )}

                  {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ display: 'inline' }} component="span" variant="h5" color="text.primary">
                      {title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {`${format(parseISO(published), 'dd-MM-yyyy HH:mm')} - ${new URL(link).hostname}`}
                      </Typography>
                    </>
                  }
                />
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
