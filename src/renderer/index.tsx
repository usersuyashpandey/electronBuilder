import { createRoot } from 'react-dom/client';
import Routes from './App';
import { AppProvider } from '../utill/ContextApi';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <AppProvider>
    <Routes />
  </AppProvider>,
);

// calling IPC exposed from preload script
if (window.electron) {
  window.electron.ipcRenderer.once('ipc-example', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
  });
  window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
}
