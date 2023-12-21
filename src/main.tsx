import React from 'react'
import ReactDOM from 'react-dom/client'
import MyApp from './App.tsx'
import { App } from 'antd'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
    <MyApp />
    </App>
  </React.StrictMode>,
)
