import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'destyle.css';
import './styles/global.css.ts';
import * as styles from './main.css.ts';
import { theme } from './styles/theme.css.ts';
import TitleBar from './components/TitleBar/TitleBar.tsx';
import classNames from 'classnames';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { trpc } from '~/trpc.ts';

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [ipcLink()],
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className={classNames(theme, styles.wrapper)}>
          <TitleBar />
          <App />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
