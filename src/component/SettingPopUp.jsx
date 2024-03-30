import React, { useState } from 'react';
import { Box, Typography, DialogContent, Dialog, Button } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { styled, useTheme } from '@mui/system';
import { healthCheckEndpoint } from '../service/ModelRapidApi';
import SwitchTheme from './constant/SwitchTheme';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import packageJson from '../../package.json';

const StyledBox = styled('div')(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? theme.palette.background.active
    : theme.palette.background.tab,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.background.border}`,
  borderRadius: 15,
  display: 'flex',
  height: '50px',
  margin: '8px',
  width: '100px',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
}));

const StyledInput = styled('input')(({ theme }) => ({
  borderRadius: 15,
  fontFamily: theme.components.typography?.fontFamily[10],
  padding: '10px',
  backgroundColor: theme.palette.background.active,
  marginRight: '8px',
  marginLeft: '8px',
  border: '1px solid' + theme.palette.background.border,
  height: '30px',
  width: '100%',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: '30px',
  fontFamily: theme.components.typography?.fontFamily[10],
  color: theme.palette.primary.main,
}));

const StyledLeftContent = styled(Box)(({ theme }) => ({
  width: 'calc(100wh - 145px)',
  height: '460px',
  padding: 2,
  paddingTop: 4,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: `2px solid ${theme.palette.background.active}`,
}));

const SettingsPopUpContent = ({ handleCloseSettings, isSettingsOpen }) => {
  const theme = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [selectedOption, setSelectedOption] = useState('apiKey');
  const webVersion = packageJson?.version;

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  const handleInputChange = (e) => {
    setApiKey(e.target.value);
    setIsInputChanged(true);
  };

  const handleAddApiKeyClick = async () => {
    await healthCheckEndpoint(apiKey).then((response) => {
      console.log('response', response);
    });
  };

  const {
    components: { typography },
  } = theme;
  const defaultfontFamily = typography?.fontFamily[10];

  return (
    <Dialog open={isSettingsOpen} onClose={handleCloseSettings} maxWidth="md">
      <DialogContent
        style={{
          padding: 0,
          backgroundColor: theme.palette.background.paper,
          width: '900px',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          style={{
            backgroundColor: theme.palette.background.screen,
            color: theme.palette.text.primary,
          }}
        >
          <StyledLeftContent>
            <Box>
              <Typography
                variant="h6"
                mb={1}
                ml={1}
                fontFamily={theme.typography.h1}
              >
                Settings
              </Typography>
              <StyledBox
                isSelected={selectedOption === 'apiKey'}
                onClick={() => handleOptionClick('apiKey')}
              >
                <Typography fontFamily={defaultfontFamily}>API Key</Typography>
              </StyledBox>
              <StyledBox
                isSelected={selectedOption === 'theme'}
                onClick={() => handleOptionClick('theme')}
              >
                <Typography fontFamily={defaultfontFamily}>Theme</Typography>
              </StyledBox>
            </Box>
            <Typography
              style={{
                ...typography?.body3Semibold,
                display: 'flex',
                marginBottom: -2,
                justifyContent: 'center',
                background: theme.palette.background.active,
                width: '103%',
              }}
            >
              <span style={{ fontSize: '15px' }}>v</span>
              {webVersion}
            </Typography>
          </StyledLeftContent>
          {selectedOption === 'apiKey' && (
            <Box
              margin="auto"
              display="flex"
              justifyContent="center"
              flex="1"
              overflow="hidden"
            >
              <Box
                padding={2}
                paddingTop={3}
                height="450px"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                style={{
                  backgroundColor: theme.palette.background.screen,
                  color: theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="h5"
                  fontFamily={theme.typography.subtitle1}
                  mt={1}
                >
                  Welcome to Xecta App
                </Typography>
                <Typography
                  variant="h6"
                  fontFamily={theme.typography.subtitle1}
                  mt={1}
                >
                  Xecta Apps uses Rapid API to sign up for a subscription.
                </Typography>
                <Box>
                  <Typography
                    variant="h6"
                    fontFamily={theme.typography.subtitle1}
                    mt={2}
                  >
                    Please follow the steps below to get the API key:
                  </Typography>
                  <ol
                    style={{
                      margin: '5px 0',
                      height: '110px',
                      fontFamily: defaultfontFamily,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <li>
                      <a
                        href="https://rapidapi.com/auth/sign-up?referral=/hub"
                        style={{ color: 'blue' }}
                        target="_blank"
                      >
                        Signup
                      </a>{' '}
                      /{' '}
                      <a
                        href="https://rapidapi.com/auth?referral=/hub"
                        target="_blank"
                      >
                        Login
                      </a>{' '}
                      to Rapid API
                    </li>
                    <li>
                      Search in Rapid API hub and navigate to{' '}
                      <a
                        href="https://rapidapi.com/xecta-xecta-default/api/xecta-model-apis/pricing"
                        style={{ color: 'blue' }}
                        target="_blank"
                      >
                        Xecta Model APIs
                      </a>
                    </li>
                    <li>
                      Check pricing details and choose an appropriate plan{' '}
                      <a
                        href="https://rapidapi.com/xecta-xecta-default/api/xecta-model-apis/pricing"
                        style={{ color: 'blue' }}
                        target="_blank"
                      >
                        here
                      </a>{' '}
                      along with payment details
                    </li>
                    <li>
                      Generate and copy your API key by following this{' '}
                      <a
                        href="https://docs.rapidapi.com/docs/keys-and-key-rotation"
                        style={{ color: 'blue' }}
                        target="_blank"
                      >
                        documentation
                      </a>
                    </li>
                  </ol>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  style={{ margin: '22px 0' }}
                >
                  <Typography width="100px" fontFamily={defaultfontFamily}>
                    API Key :{' '}
                  </Typography>
                  <StyledInput onChange={handleInputChange} />
                  <Box sx={{ height: '10px' }}>
                    <StyledButton
                      variant="contained"
                      onClick={handleAddApiKeyClick}
                      disabled={!isInputChanged}
                      value={apiKey}
                    >
                      Add
                    </StyledButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          {selectedOption === 'theme' && (
            <Box
              textAlign="start"
              width="650px"
              height="450px"
              padding={1}
              paddingTop={5}
            >
              <SwitchTheme />
            </Box>
          )}
          <Box
            p={2}
            style={{
              backgroundColor: theme.palette.background.screen,
              color: theme.palette.text.primary,
            }}
          >
            <Clear
              onClick={handleCloseSettings}
              style={{ cursor: 'pointer', color: theme.palette.text.primary }}
            />
          </Box>
        </Box>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
};

export default SettingsPopUpContent;
