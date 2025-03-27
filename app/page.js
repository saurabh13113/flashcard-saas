/* eslint-disable react/jsx-key */

"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  CssBaseline,
  Switch,
  useMediaQuery,
  FormControlLabel,
  Divider,
  Link
} from "@mui/material";
import Head from "next/head";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { styled, keyframes } from "@mui/system";
import { useState, useMemo } from "react";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MemoryIcon from '@mui/icons-material/Memory';
import DevicesIcon from '@mui/icons-material/Devices';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
`;

const AnimatedTypography = styled(Typography)`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid;
  animation: 
    ${typing} 3s steps(20) 1s forwards,
    ${blink} 0.75s step-end infinite;
  width: 0;
`;

const HoverBox = styled(Box)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  '&:hover': {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

const GlowText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textShadow: '0 0 10px rgba(0, 191, 174, 0.8), 0 0 20px rgba(0, 191, 174, 0.5)',
}));

export default function Home() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: '#00bfae',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#e0e0e0' : '#000000',
          secondary: darkMode ? '#b0b0b0' : '#333333',
        },
      },
    }), [darkMode]);

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "https://localhost:3000",
      },
    });
    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.statusCode === 500) return;
    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId: checkoutSessionJson.id });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" disableGutters>
        <Head>
          <title>Flashgenie</title>
          <meta name="Description" content="Create flashcards from your text" />
        </Head>

        <AppBar position="static" sx={{ width: "100%" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: darkMode ? '#00bfae' : '#7a00e6', textShadow: '0 0 5px #00bfae, 0 0 10px #00bfae' }}>
              <AutoAwesomeIcon sx={{ mr: 1 }} /> Flashgenie
            </Typography>
            <FormControlLabel
              control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
              label="Dark Mode"
              sx={{ color: 'text.primary', textShadow: darkMode ? '0 0 5px #00bfae, 0 0 10px #00bfae' : '0 0 5px #7a00e6, 0 0 10px #7a00e6' }}
            />
            <HoverBox sx={{ p: 1, borderRadius: 3, '&:hover': { backgroundColor: 'background.neutral' } }}>
              <Button color="inherit" href="/flashcards">My Flashcards</Button>
            </HoverBox>
            <SignedOut>
              <Button color="inherit" href="/sign-in">Login</Button>
              <Button color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box textAlign="center" my={4} py={6} sx={{ backgroundColor: 'background.paper', borderRadius: 3, mx: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatedTypography
            variant="h2"
            sx={{ color: 'text.neon', textShadow: '0 0 5px #00bfae, 0 0 10px #00bfae' }}
            options={{ cursor: 'none' }}
          >
            Welcome to FlashGenie!
          </AnimatedTypography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            The easiest way to make flashcards from your text
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 4, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
            href="/generate"
          >
            Get started
          </Button>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box my={6} py={4} px={2} sx={{ backgroundColor: 'background.paper', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            {[{ title: 'Easy Text Input', icon: <AutoAwesomeIcon /> }, { title: 'Smart Flashcards', icon: <MemoryIcon /> }, { title: 'Accessible Anywhere', icon: <DevicesIcon /> }].map(({ title, icon }, index) => (
              <Grid item xs={12} md={4} key={title}>
                <HoverBox sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.default', textAlign: 'center' }}>
                  {icon}
                  <Typography variant="h6" color="primary" gutterBottom>{title}</Typography>
                  <Typography>
                    {index === 0 && 'Simply input your text and let our software do the rest.'}
                    {index === 1 && 'Our AI intelligently breaks down your text into concise flashcards.'}
                    {index === 2 && 'Access your flashcards from any device, at any time. Study on the go with ease.'}
                  </Typography>
                </HoverBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box my={6} py={4} px={2} sx={{ backgroundColor: 'background.paper', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom>Pricing</Typography>
          <Grid container spacing={4}>
            {[{ plan: 'Basic', price: '$5 / month', icon: <WorkOutlineIcon /> }, { plan: 'Pro', price: '$10 / month', icon: <RocketLaunchIcon /> }].map((item, index) => (
              <Grid item xs={12} md={6} key={item.plan}>
                <HoverBox sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.default', textAlign: 'center' }}>
                  {item.icon}
                  <Typography variant="h5" gutterBottom>{item.plan}</Typography>
                  <Typography variant="h6" gutterBottom color="primary">{item.price}</Typography>
                  <Typography>
                    {item.plan === 'Basic'
                      ? 'Access to basic flashcard features and limited storage.'
                      : 'Unlimited flashcards and storage with priority support.'}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                    onClick={() => window.open(index === 0
                      ? 'https://buy.stripe.com/test_aEUg1AbREbgZ9FK6oo'
                      : 'https://buy.stripe.com/test_eVabLk2h4fxfdW04gh', '_blank')}
                  >
                    Choose {item.plan}
                  </Button>
                </HoverBox>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box textAlign="center" my={6}>
          <Typography variant="h4" gutterBottom>What Users Say</Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            This tool changed the way I study. So intuitive and simple to use! – Jane D.
          </Typography>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box textAlign="center" py={4}>
          <Typography variant="body2" sx={{ mb: 1 }}>Made with ❤️ by Saurabh Nair</Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Link href="https://www.instagram.com/saurabh_13113/" target="_blank">
              <TwitterIcon sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }} />
            </Link>
            <Link href="https://www.linkedin.com/in/saurabhnair13113/" target="_blank">
              <LinkedInIcon sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }} />
            </Link>
            <Link href="https://github.com/saurabh13113" target="_blank">
              <GitHubIcon sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }} />
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
