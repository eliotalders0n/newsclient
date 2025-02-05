import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTheme } from './themeContext';
import HomeIcon from '@mui/icons-material/Home';
import ArchiveIcon from '@mui/icons-material/Archive';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import MicIcon from '@mui/icons-material/Mic';
import PersonIcon from '@mui/icons-material/Person';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [value, setValue] = useState(location.pathname);

  const handleNavigation = (path) => {
    setValue(path);
    navigate(path);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => handleNavigation(newValue)}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: theme === 'light' ? 'whitesmoke' : '#2C2C2C',
        color: theme === 'light' ? '#2C2C2C' : 'white',
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="/home"
        icon={<HomeIcon />}
        sx={{
          color: value === '/home' ? 'green' : theme === 'light' ? '#2C2C2C' : 'white',
        }}
      />
      <BottomNavigationAction
        label="Resources"
        value="/resources"
        icon={<ArchiveIcon />}
        sx={{
          color: value === '/resources' ? 'green' : theme === 'light' ? '#2C2C2C' : 'white',
        }}
      />
      <BottomNavigationAction
        label="Videos"
        value="/reels"
        icon={<MovieCreationIcon />}
        sx={{
          color: value === '/reels' ? 'green' : theme === 'light' ? '#2C2C2C' : 'white',
        }}
      />
      <BottomNavigationAction
        label="Podcast"
        value="/podcast"
        icon={<MicIcon />}
        sx={{
          color: value === '/podcast' ? 'green' : theme === 'light' ? '#2C2C2C' : 'white',
        }}
      />
      <BottomNavigationAction
        label="Profile"
        value="/profile"
        icon={<PersonIcon />}
        sx={{
          color: value === '/profile' ? 'green' : theme === 'light' ? '#2C2C2C' : 'white',
        }}
      />
    </BottomNavigation>
  );
};

export default Navigation;
