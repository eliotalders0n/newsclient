import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Typography,
  Button,
  MobileStepper,
  Box,
  useTheme,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Replace these with actual images
import Image1 from "../assets/hello.gif";
import Image2 from "../assets/Motion.gif";
import Image3 from "../assets/People.gif";

const steps = [
  {
    title: "E-ATI",
    description:
      "Stay informed with the latest government news and updates tailored for you.",
    image: Image1,
  },
  {
    title: "Respectful Engagement",
    description:
      "Please avoid sharing sensitive information or explicit content while interacting within the app.",
    image: Image2,
  },
  {
    title: "Empowering Citizens",
    description:
      "Your voice matters. Engage responsibly and stay connected to your government.",
    image: Image3,
  },
];

const Intro = ({ onFinish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  // Preload images
  useEffect(() => {
    steps.forEach((step) => {
      const img = new Image();
      img.src = step.image;
    });
  }, []);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Call the onFinish callback if provided, else navigate to login
      if (onFinish) {
        onFinish();
      } else {
        navigate("/login");
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <Container
      maxWidth={false} // Disable maxWidth constraint
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 0, // Ensure no padding
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100vh",
          mx: 0, // Remove horizontal margin
          borderRadius: 0, // Remove border radius if you want
          boxShadow: "none", // Remove shadow if desired
          // Remove maxWidth: "md" completely
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: { xs: "50vh", sm: 500 },
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeStep}
              src={steps[activeStep].image}
              alt={steps[activeStep].title}
              style={{
                width: "100%",
                height: "70%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </Box>

        <Box sx={{ p: 1, textAlign: "center", mt:"-50px" }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            {steps[activeStep].title}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            {steps[activeStep].description}
          </Typography>

          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{
              background: "transparent",
              justifyContent: "center",
              gap: 1,
              "& .MuiMobileStepper-dot": {
                width: 12,
                height: 12,
                backgroundColor: "rgba(0,0,0,0.2)",
              },
              "& .MuiMobileStepper-dotActive": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
            nextButton={
              <Button
                size="large"
                onClick={handleNext}
                variant={activeStep === steps.length - 1 ? "contained" : "text"}
                sx={{
                  borderRadius: 8,
                  px: 2,
                  ...(activeStep === steps.length - 1 && {
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": { bgcolor: theme.palette.primary.dark },
                  }),
                }}
              >
                {activeStep === steps.length - 1 ? "Get Started" : "Next"}
                <KeyboardArrowRight fontSize="large" />
              </Button>
            }
            backButton={
              <Button
                size="large"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ color: "text.secondary" }}
              >
                <KeyboardArrowLeft fontSize="large" />
                Back
              </Button>
            }
          />
        </Box>
      </Card>
    </Container>
  );
};

export default Intro;
