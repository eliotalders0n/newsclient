import React from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchSection = ({ searchTerm, setSearchTerm, resetFilters }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 4,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search Articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="outlined"
        onClick={resetFilters}
        sx={{
          whiteSpace: "nowrap",
          alignSelf: { xs: "stretch", sm: "center" },
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default SearchSection;
