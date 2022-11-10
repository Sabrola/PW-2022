import './App.css';
import TopBar from './ui/TopBar'
import { createTheme, ThemeProvider } from '@mui/material'
import Box from '@mui/material/Box'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { yellow, pink } from '@mui/material/colors'
import KarangoList from './pages/karangoList'
import karangoForm from './pages/karangoForm'

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: yellow[500]
    },
    secondary: {
      main: pink[500]
    }
  }
})


function App() {
  return (
    <>
    <ThemeProvider theme={customTheme}>
      
    <Box sx={{
            minHeight: '100vh',
            backgroundColor: customTheme.palette.background.default,
            color: customTheme.palette.text.primary
          }}>

          <BrowserRouter>
            
            <TopBar />

            <Box component="main" sx={{ m: '24px' /* Margin: '24px */ }} >
              <Routes>
                <Route path='/karango' element={< KarangoList />} />
                <Route path='/karango/novo' element={< karangoForm />} />
              </Routes>
            </Box>
          </BrowserRouter>
    </Box>

    </ThemeProvider>
    </>
  );
}

export default App;