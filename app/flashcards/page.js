/* eslint-disable react/jsx-key */
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  Box,
  CssBaseline,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDarkMode(stored === "true");
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: { main: "#00bfae" },
        background: {
          default: darkMode ? "#121212" : "#f5f5f5",
          paper: darkMode ? "#1e1e1e" : "#ffffff",
        },
        text: {
          primary: darkMode ? "#ffffff" : "#000000",
        },
      },
    }), [darkMode]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const getFlashcards = async () => {
      const userRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFlashcards(data.flashcards || []);
      } else {
        await setDoc(userRef, { flashcards: [] });
        setFlashcards([]);
      }
    };

    getFlashcards();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!isSignedIn) {
    return <Typography variant="h6">Please sign in to access this page.</Typography>;
  }

  const handleCardClick = (name) => {
    router.push(`/flashcard?id=${encodeURIComponent(name)}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box display="flex" justifyContent="flex-end">
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#00bfae' }}>
            📚 My Flashcards
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse your flashcard collections and click to review them.
          </Typography>
        </Box>

        {flashcards.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            You haven not created any flashcards yet.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.name}>
                <Card
                  sx={{
                    border: "2px solid #00bfae",
                    transition: "transform 0.3s ease",
                    '&:hover': {
                      transform: 'scale(1.02)',
                      cursor: 'pointer',
                      boxShadow: '0 0 10px rgba(0, 191, 174, 0.4)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: "#00bfae",
                          textShadow: "0 0 6px rgba(0, 191, 174, 0.6)"
                        }}
                      >
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}
