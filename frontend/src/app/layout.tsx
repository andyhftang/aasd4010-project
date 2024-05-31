import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import HeadMenu from '@/component/HeadMenu'
import { Container, CssBaseline } from '@mui/material'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LoHi - Buy low, Sell high!',
  description: 'AASD4010 Final Project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <HeadMenu />
        <Container maxWidth="lg">{children}</Container>
      </body>
    </html>
  )
}
