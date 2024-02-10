import { useEffect } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gtm } from '../lib/gtm';
import { useAuth } from '../hooks/use-auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const AuthorizationRequired = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { logout } = useAuth();


  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/authentication/login').catch(console.error);
      toast.success('You have been successfully logged out');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };
  return (
    <>
      <Head>
        <title>
          You have been successfully logged-in!! The website is under construction.
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          py: '80px'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            variant={mobileDevice ? 'h4' : 'h1'}
          >
            Success!!!!
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 0.5 }}
            variant="subtitle2"
          >
          Website is under construction.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={`/static/error/error401_${theme.palette.mode}.svg`}
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            {/* <NextLink
              href="/authentication/login"
              passHref
            > */}
              <Button onClick={handleLogout}
                component="a"
                variant="outlined"
              >
                Back to Login
              </Button>
            {/* </NextLink> */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AuthorizationRequired;
