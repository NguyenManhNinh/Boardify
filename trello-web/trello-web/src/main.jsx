import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import { ConfirmProvider } from 'material-ui-confirm';

//cau hinh render toastify
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './customHooks/useAuthContext'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App.jsx';
import './index.css';


// Cleanup component to fix aria-hidden focus issues
const Cleanup = () => {
  useEffect(() => {
    // Remove aria-hidden from root and body that may be left from previous modals
    const root = document.getElementById('root');
    const body = document.body;
    if (root && root.getAttribute('aria-hidden') === 'true') {
      root.removeAttribute('aria-hidden');
    }
    if (body.getAttribute('aria-hidden') === 'true') {
      body.removeAttribute('aria-hidden');
    }
  }, []);
  return null;
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'inherit' }
        }}>
          <CssBaseline />
          <BrowserRouter>
            <AuthProvider>
              <Cleanup />
              <App />
              {/* <ToastContainer position="bottom-left" theme="colored" /> */}
            </AuthProvider>
          </BrowserRouter>
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </React.StrictMode>
);
