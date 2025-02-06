import React from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";
import AudioPlayer from "../template/player";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import useGetPodcasts from "../hooks/useGetPodcasts";
import { useTheme as useCustomTheme } from "../template/themeContext";

const PodcastList = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const { audioData } = useGetPodcasts();
  const { theme: appTheme } = useCustomTheme(); // Custom theme hook

  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1);
  const currentSong = audioData[currentSongIndex];

  // Filter the audioData array to include only songs where song.ministry equals data.id
  const filteredAudioData = audioData.filter(
    (song) => song.ministry === data.id
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, side by side on desktop
        minHeight: "100vh",
        marginTop: "10vh",
        paddingTop: "6px",
        backgroundColor: appTheme === "light" ? "#f5f5f5" : "#121212", // Use the theme for background
        color: appTheme === "light" ? "#000" : "#fff", // Use the theme for text color
      }}
    >
      {/* Left Column: Podcast List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          overflowY: "auto",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          align="center"
          fontWeight="bold"
          mb={4}
          sx={{
            color: appTheme === "light" ? "#000" : "#fff", // Apply theme color for text
            textTransform: "uppercase",
          }}
        >
          {data.name}
        </Typography>

        {filteredAudioData.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
          >
            <Typography
              variant="h6"
              color={appTheme === "light" ? "#000" : "#fff"}
            >
              No Podcasts available for this ministry yet
            </Typography>
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{
              maxHeight: "65vh",
              overflowY: "auto",
              backgroundColor: appTheme === "light" ? "#fff" : "#1E1E1E", // Paper color based on theme
              borderRadius: 2,
             
            }}
          >
            <List>
              {filteredAudioData.map((song, index) => (
                <ListItem
                  key={song.title}
                  sx={{
                    backgroundColor:
                      currentSongIndex === index
                        ? appTheme === "light"
                          ? "#1976D2"
                          : "#333" // Highlight color based on theme
                        : "transparent",
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <Button
                    onClick={() => setCurrentSongIndex(index)}
                    fullWidth
                    variant="text"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textTransform: "none",
                      color:
                        currentSongIndex === index
                          ? "#FFFFFF"
                          : appTheme === "light"
                          ? "#000000"
                          : "#BBBBBB",
                      fontSize: "1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "5%",
                        textAlign: "center",
                      }}
                    >
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        pl: 2,
                        pr: 2,
                        whiteSpace: "wrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      className="text-truncate"
                    >
                      {song.title}
                    </Typography>
                    <span>
                      {index === currentSongIndex ? (
                        <MdPause size={24} />
                      ) : (
                        <MdPlayArrow size={24} />
                      )}
                    </span>
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Right Column: Audio Player */}
      {filteredAudioData.length > 0 && (
        <Box
          sx={{
            width: { xs: "100%", sm: "35%" }, // Full width on mobile, fixed width on desktop
            position: "sticky",
            top: 0,
            zIndex: 999,
            p: { xs: 2, sm: 3 },
            bottom: "6vh",
          }}
        >
          <AudioPlayer
            key={currentSongIndex}
            currentSong={currentSong}
            songCount={filteredAudioData.length}
            songIndex={currentSongIndex}
            onNext={() =>
              setCurrentSongIndex((i) =>
                i + 1 < filteredAudioData.length ? i + 1 : i
              )
            }
            onPrev={() => setCurrentSongIndex((i) => (i - 1 >= 0 ? i - 1 : i))}
          />
        </Box>
      )}
    </Box>
  );
};

export default PodcastList;
