import React from 'react';
import ReactDOM from 'react-dom/client';
import MyApp from './App.tsx';
import { App, Watermark } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
      <Watermark
        content={'PPG007 tools'}
        font={{
          color: 'rgba(103,100,100,0.5)',
        }}
      >
        <MyApp/>
      </Watermark>
    </App>
  </React.StrictMode>,
);
