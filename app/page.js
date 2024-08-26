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
} from "@mui/material";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled, keyframes } from "@mui/system";

// Define the keyframes for the typing animation
const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: currentColor; }
`;

// Create a styled Typography component
const AnimatedTypography = styled(Typography)`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid; /* Cursor effect */
  animation: 
    ${typing} 3s steps(20) 1s forwards, /* Typing effect */
    ${blink} 0.75s step-end; /* Blinking cursor */
  width: 0; /* Start with 0 width */
`;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bfae', // Teal color
    },
    background: {
      default: '#121212', // Dark background color
      paper: '#1e1e1e', // Darker background for paper elements
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#00bfae',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#00a89a',
          },
          boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h2: {
          fontWeight: 'bold',
          color: '#ffffff',
        },
        h4: {
          fontWeight: 'bold',
          color: '#00bfae',
        },
        h6: {
          fontWeight: 'bold',
          color: '#e0e0e0',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          color: '#e0e0e0',
        },
      },
    },
  },
});

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "https://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();

    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" disableGutters>
        <Head>
          <title>Flashgenie</title>
          <meta name="Description" content="Create flashcard from your text" />
        </Head>

        <AppBar position="static" sx={{ width: "100%" }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Flashgenie
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box
      sx={{
        textAlign: "center",
        my: 4,
        background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
        color: 'text.primary',
        p: 4,
      }}
    >
      <AnimatedTypography variant="h2">
        Welcome to FlashGenie
      </AnimatedTypography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        The easiest way to make flashcards from your text
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 4 }}
        href="/generate"
      >
        Get started
      </Button>
    </Box>

        <Box sx={{ my: 6,background: 'linear-gradient(180deg, #000000 0%, #4682B4 100%)', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  backgroundColor: '#F0FFFF',
                  boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
                }}
              >
                <Typography variant="h6" gutterBottom color={'#DC143C'}>
                  Easy Text Input
                </Typography>
                <Typography>
                  Simply input your text and let our software do the rest. Creating
                  flashcards has never been easier.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  backgroundColor: '#F0FFFF',
                  boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
                }}
              >
                <Typography variant="h6" gutterBottom color={'#DC143C'}>
                  Smart Flashcards
                </Typography>
                <Typography>
                  Our AI intelligently breaks down your text into concise
                  flashcards.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  backgroundColor: '#F0FFFF',
                  boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
                }}
              >
                <Typography variant="h6" gutterBottom color={'#DC143C'}>
                  Accessible Anywhere
                </Typography>
                <Typography>
                  Access your flashcards from any device, at any time. Study on the
                  go with ease.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, background: 'linear-gradient(180deg, #000000 0%, #228B22 100%)', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Pricing
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  backgroundColor: '#F0FFFF',
                  boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom color={'#00CED1'}>
                  $5 / month
                </Typography>
                <Typography>
                  Access to basic flashcard features and limited storage.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  backgroundColor: '#F0FFFF',
                  boxShadow: '0 4px 10px rgba(0, 191, 174, 0.5)',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom color={'#00CED1'}>
                  $10 / month
                </Typography>
                <Typography>
                  Unlimited flashcards and storage with priority support.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
