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
} from "@mui/material";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/firebase";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }
      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Empty response");
      }

      const data = JSON.parse(responseText);
      setFlashcards(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with that name already exists!");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const columnRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(columnRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
          p: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            textAlign: "center",
            fontWeight: "bold",
            textShadow: "0 0 8px teal",
            mb: 3,
          }}
        >
          Generate Flashcards
        </Typography>
        <Paper
          sx={{
            p: 4,
            width: "100%",
            backgroundColor: "#2e2e2e",
            color: "#FFFFFF",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "#3e3e3e",
              borderColor: "teal",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "teal",
                },
                "&:hover fieldset": {
                  borderColor: "#00bcd4",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "teal",
                },
              },
            }}
            InputLabelProps={{
              style: { color: "teal" },
            }}
            InputProps={{
              style: { color: "#FFFFFF" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{
              backgroundColor: "teal",
              "&:hover": {
                backgroundColor: "#008080",
              },
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "#FFFFFF",
              textAlign: "center",
              mb: 4,
            }}
          >
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#2e2e2e",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4)",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          },
                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                          },
                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpen}
              sx={{
                backgroundColor: "teal",
                "&:hover": {
                  backgroundColor: "#008080",
                },
                color: "#FFFFFF",
                fontWeight: "bold",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
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
            sx={{
              backgroundColor: "#3e3e3e",
              borderColor: "teal",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "teal",
                },
                "&:hover fieldset": {
                  borderColor: "#00bcd4",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "teal",
                },
              },
            }}
            InputLabelProps={{
              style: { color: "teal" },
            }}
            InputProps={{
              style: { color: "#FFFFFF" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            Cancel
          </Button>
          <Button onClick={saveFlashcards} sx={{ color: "teal" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
