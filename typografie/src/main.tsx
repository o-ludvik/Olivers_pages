import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/roboto/latin-ext-400.css'
import '@fontsource/roboto/latin-ext-700.css'
import '@fontsource/open-sans/latin-400.css'
import '@fontsource/open-sans/latin-700.css'
import '@fontsource/open-sans/latin-ext-400.css'
import '@fontsource/open-sans/latin-ext-700.css'
import '@fontsource/merriweather/latin-400.css'
import '@fontsource/merriweather/latin-700.css'
import '@fontsource/merriweather/latin-ext-400.css'
import '@fontsource/merriweather/latin-ext-700.css'
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/latin-700.css'
import '@fontsource/lora/latin-ext-400.css'
import '@fontsource/lora/latin-ext-700.css'
import '@fontsource/pt-serif/latin-400.css'
import '@fontsource/pt-serif/latin-700.css'
import '@fontsource/pt-serif/latin-ext-400.css'
import '@fontsource/pt-serif/latin-ext-700.css'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
