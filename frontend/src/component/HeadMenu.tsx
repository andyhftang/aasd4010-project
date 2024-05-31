'use client'

import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'

export default function HeadMenu() {
  return (
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => {
            console.log('OOO')
          }}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          LoHi
        </Typography>
        {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button sx={{ color: '#fff' }}></Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  )
}
