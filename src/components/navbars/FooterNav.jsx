import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import Paper from '@mui/material/Paper';

// * Final Material UI Icons ****************************************************************
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
// *******************************************************************************************

// * React Icons ****************************************************************
import { SlHome } from 'react-icons/sl';
import { SlFire } from 'react-icons/sl';
import { SlUser } from 'react-icons/sl';
// *******************************************************************************************

// *********************************TESTING PURPOSE***************************************
import { NavContext } from '../../context/NavContex';

// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemText from '@mui/material/ListItemText';
// import Avatar from '@mui/material/Avatar';

// * For Navigating over pages
import { useNavigate, useLocation } from 'react-router-dom';

// function refreshMessages() {
//   const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

//   return Array.from(new Array(50)).map(
//     () => messageExamples[getRandomInt(messageExamples.length)]
//   );
// }

export default function FixedBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // const [value, setValue] = React.useState(0);
  const { value, setValue } = React.useContext(NavContext);
  const ref = React.useRef(null);
  //   const [messages, setMessages] = React.useState(() => refreshMessages());

  //   React.useEffect(() => {
  //     ref.current.ownerDocument.body.scrollTop = 0;
  //     setMessages(refreshMessages());
  //   }, [value, setMessages]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      {/* <List>
        {messages.map(({ primary, secondary, person }, index) => (
          <ListItemButton key={index + person}>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItemButton>
        ))}
      </List> */}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeTwoToneIcon />}
            onClick={() => {
              navigate('/');
            }}
          />
          <BottomNavigationAction
            label="Offers"
            icon={<LocalFireDepartmentTwoToneIcon />}
            onClick={() => {
              navigate('/offers');
            }}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<PersonOutlineTwoToneIcon />}
            onClick={() => {
              navigate('/profile');
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
