import React from 'react';
import ReactDOM from 'react-dom/client';
import '@vkontakte/vkui/dist/vkui.css';
import './index.scss';
import {AppConfig} from "./AppConfig";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AppConfig/>
);
