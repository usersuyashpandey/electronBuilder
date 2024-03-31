import {
  createHashRouter,
  useRouteError,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import Layout from '../component/layout/Layout';
import Forecast from '../pages/Forecast';
import Bhp from '../pages/BHP';
import ComingSoon from '../component/ComingSoon';
import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppContext } from '../utill/ContextApi';
import darkTheme from '../styles/DarkTheme';
import lightGrayTheme from '../styles/LightTheme';

const ErrorBoundary: React.FC = () => {
  const newError = useRouteError();
  console.error(newError);
  return <div>Dang!</div>;
};

const Routes: React.FC = () => {
  const {
    isDarkMode,
    // selectedRoute,
    toggleTheme,
    handleRouteChange,
  } = useAppContext();
  const selectedTheme = !isDarkMode ? darkTheme : lightGrayTheme;
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: 'forecast',
          element: <Forecast />,
        },
        {
          path: 'bhp',
          element: <Bhp />,
        },
        {
          path: 'liquidLoading',
          element: <ComingSoon />,
        },
        {
          index: true,
          element: <Bhp />,
        },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      <div style={{ display: 'flex' }}>
        <RouterProvider
          router={router}
          fallbackElement={<CircularProgress />}
        />
      </div>
    </ThemeProvider>
  );
};
export default Routes;
