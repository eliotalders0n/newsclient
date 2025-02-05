import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Button,
  Modal,
  Stack,
  TextField,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  Facebook,
  WhatsApp,
  Twitter,
  Telegram,
  Share,
  Close,
  CopyAll,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../template/themeContext';
import useGetReels from '../hooks/useGetReels';
import firebase from '../../firebase';

const ReelCard = () => {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const [shareArticleId, setShareArticleId] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const theme = useTheme();
  const { theme: appTheme } = useCustomTheme();
  const reels = useGetReels().docs;

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribeAuthors = firebase
      .firestore()
      .collection('Users')
      .onSnapshot((snapshot) => {
        const authorsData = {};
        snapshot.docs.forEach((doc) => {
          authorsData[doc.id] = doc.data();
        });
        setAuthors(authorsData);
        setLoading(false);
      });

    return () => {
      unsubscribeAuthors();
    };
  }, []);

  const handleShareClose = () => setShowShare(false);
  const handleShareShow = (id) => {
    setShareArticleId(id);
    setShowShare(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: appTheme === 'light' ? 'whitesmoke' : '#2C2C2C',
        color: appTheme === 'light' ? '#111111' : 'white',
        minHeight: '100vh',
        padding: "10vh 2vh",
        mt: 8,
      }}
    >
      <Typography
              align="center"
              sx={{ fontFamily: "Roboto Condensed", fontStyle: "normal", paddingBottom: "10px" }}
            >
              Videos
            </Typography>
      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={200} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" height={50} />
        </Stack>
      ) : reels.length === 0 ? (
        <Typography variant="h4" textAlign="center" mt={4}>
          <strong>Oops!</strong> No content available. Try again later.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {reels.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: appTheme === 'light' ? 'white' : '#333333',
                  color: appTheme === 'light' ? '#111111' : 'white',
                  boxShadow: 3,
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <CardMedia
                  component="video"
                  src={article.imagesUrls}
                  controls
                  sx={{
                    borderRadius: '8px 8px 0 0',
                    height: 200,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom className="text-truncate">
                    {article.title}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                    <Avatar
                      src={authors[article.author]?.photoURL}
                      alt="Author"
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2">
                      {authors[article.author]?.firstName}{' '}
                      {authors[article.author]?.lastName}
                    </Typography>
                    <IconButton
                      onClick={() => handleShareShow(article.id)}
                      sx={{ marginLeft: 'auto' }}
                    >
                      <Share />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Share Modal */}
      <Modal open={showShare} onClose={handleShareClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: appTheme === 'light' ? 'white' : '#2C2C2C',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: isMobile ? '90%' : 400,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Share this Reel</Typography>
            <IconButton onClick={handleShareClose}>
              <Close />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            <IconButton>
              <Facebook color="primary" />
            </IconButton>
            <IconButton>
              <WhatsApp color="success" />
            </IconButton>
            <IconButton>
              <Twitter color="info" />
            </IconButton>
            <IconButton>
              <Telegram color="primary" />
            </IconButton>
          </Stack>
          <Typography variant="body2" mt={3} mb={1}>
            Or copy the link:
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              value={`https://zanis-pro.web.app/reels/${shareArticleId}`}
              fullWidth
              size="small"
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `https://zanis-pro.web.app/reels/${shareArticleId}`
                  )
                  .then(() => console.log('Copied to clipboard'))
                  .catch((error) =>
                    console.error('Failed to copy:', error)
                  );
              }}
            >
              <CopyAll />
            </IconButton>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleShareClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReelCard;
