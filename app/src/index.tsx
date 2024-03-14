import React from 'react';
import ReactDOM from 'react-dom/client';
import {AdaptivityProvider, AppRoot, ConfigProvider} from "@vkontakte/vkui";
import '@vkontakte/vkui/dist/vkui.css';
import './index.scss';
import {App} from './App';
import {RouterProvider} from "@vkontakte/vk-mini-apps-router";
import {router} from "./routes";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router}>
    <ConfigProvider appearance="light" platform="vkcom">
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  </RouterProvider>
);
