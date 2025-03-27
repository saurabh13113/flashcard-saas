"use client";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
  CssBaseline,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { collection, doc,addDoc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const router = useRouter();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const theme = useMemo(
    () =>
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
      }),
    [darkMode]
  );

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });
      if (!response.ok) throw new Error(await response.text());
      const data = JSON.parse(await response.text());
      setFlashcards(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCloseDialog = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const saveFlashcards = async () => {
    if (!name) return alert("Please enter a name");
    if (!flashcards.length) return alert("No flashcards to save!");

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    // Save collection metadata
    const collections = docSnap.exists() ? docSnap.data().flashcards || [] : [];
    if (collections.find((f) => f.name === name)) {
      return alert("Flashcard collection with that name already exists!");
    }
    collections.push({ name });
    batch.set(userDocRef, { flashcards: collections }, { merge: true });
    await batch.commit();

    // Save individual cards
    const collectionRef = collection(userDocRef, name);
    await Promise.all(
      flashcards.map((card) => addDoc(collectionRef, card))
    );

    setOpen(false);
    setSnackbarOpen(true);
    router.push("/flashcards");

  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Dark Mode"
          sx={{ mt: 2 }}
        />

        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
            background: darkMode ? "linear-gradient(to bottom right, #1e1e1e, #2e2e2e)" : "linear-gradient(to bottom right, #f5f5f5, #ffffff)",
            borderRadius: 2,
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: 6,
          }}
        >
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: darkMode ? '#e0e0e0' : '#000000' }}>
              📇 Generate Flashcards
            </Typography>
            <Paper sx={{ p: 3, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff' }}>
              <TextField
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCharCount(e.target.value.length);
                }}
                label="Enter Text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setText("")}> <CloseIcon /> </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', color: darkMode ? '#e0e0e0' : '#000000' }}
              />
              <Typography variant="caption" color="text.secondary">
                Character count: {charCount}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                ✍️ Submit
              </Button>
            </Paper>
          </Box>
        </Box>

        {flashcards.length > 0 && (
          <Box>
            <Typography variant="h5" textAlign="center" gutterBottom>
              🧠 Flashcards Preview
            </Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "background.paper",
                      border: "2px solid #00bfae", // Green border
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        cursor: "pointer",
                      },
                      height: 220,
                      perspective: "1000px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <CardActionArea>
                      <Box
                        sx={{
                          height: "100%",
                          transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                          transition: "transform 0.6s",
                          transformStyle: "preserve-3d",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{
                              color: "#00bfae", // Glowing text color
                              textShadow: "0 0 10px rgba(0, 191, 174, 0.8), 0 0 20px rgba(0, 191, 174, 0.5)",
                            }}
                          >
                            {flashcard.front}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" align="center">
                            {flashcard.back}
                          </Typography>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
              <Button variant="contained" onClick={() => setOpen(true)}>
                💾 Save
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcards collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message="Flashcards saved successfully!"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Container>
    </ThemeProvider>
  );
}
