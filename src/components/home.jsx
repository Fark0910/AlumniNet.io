import React, { useState, useEffect } from 'react';
import logoImage from '../assets/passed.png';
import logi from '../assets/prof.png';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Link,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import useAuthGuard from '../sessionmanager/useAuthGuard';
import Header from './header';
import EditAlumni from './editalumni';
import backgroundVideo from '../assets/cloudy.mp4';
import { auth, db } from '../firebase_set/firebase';
import { signOut } from 'firebase/auth';

const Home = () => {
  useAuthGuard();
  const location = useLocation();
  const username = location.state?.username;
  const [showEdit, setShowEdit] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAlumniData = async () => {
      const snapshot = await getDocs(collection(db, 'alumni'));
      const alumniData = snapshot.docs.map((doc) => doc.data());

      const alumniWithDetails = alumniData.map((alumni) => ({
        ...alumni,
        educationList: alumni.educationList || [],
        resumeUrl: alumni.resumeUrl || null,
      }));

      setAlumniList(alumniWithDetails);
      const userData = alumniWithDetails.find((alumni) => alumni.name === username);
      setCurrentUserData(userData);
    };

    fetchAlumniData();
  }, [username]);

  const handleSearchChange = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredAlumni = alumniList.filter((alumni) =>
    alumni.name.toLowerCase().includes(searchQuery) ||
    alumni.passYear.toLowerCase().includes(searchQuery) ||
    alumni.college?.toLowerCase().includes(searchQuery)
  );

  const handleEditClick = () => {
    setShowEdit(true);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
    setShowEdit(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const handleBackClick = () => {
    setSelectedAlumni(null);
  };

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        height: '100vh', zIndex: -1, overflow: 'hidden',
      }}>
        <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      <Header
        onEditProfileClick={handleEditClick}
        onProfileClick={handleProfileClick}
        onSearchChange={handleSearchChange}
      />

      {showEdit ? (
        <EditAlumni name={username} />
      ) : showProfile ? (
        <Container sx={{ pt: 10 }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>My Profile</Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
                           <Box
                             component="img"
                             src={logi}
                             alt="imagi"
                             sx={{
                               height: 150,
                               opacity: 1,
                               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                               filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))',
                               '&:hover': {
                                 transform: 'translateY(-10px)',
                                 boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                               },
                             }}
                           />
            </Box>
          <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 4 }}>
            <Typography><strong>Name:</strong> {currentUserData?.name}</Typography>
            
            <Typography><strong>Pass Year:</strong> {currentUserData?.passYear}</Typography>
            <Typography><strong>Description:</strong> {currentUserData?.description}</Typography>

            {currentUserData?.educationList?.map((edu, i) => (
              <Typography key={i} sx={{ mt: 1 }}>
                <strong>Education {i + 1}:</strong> {edu.degree} @ {edu.institute}
              </Typography>
            ))}

            {currentUserData?.resumeUrl && (
              <Typography sx={{ mt: 2 }}>
                <strong>Resume: </strong>
                <Link href={currentUserData.resumeUrl} target="_blank" rel="noopener noreferrer">Download</Link>
              </Typography>
            )}
            <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Container>
      ) : selectedAlumni ? (
        <Container sx={{ pt: 10 }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            {selectedAlumni.name}'s Profile
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
                           <Box
                             component="img"
                             src={logi}
                             alt="imagi"
                             sx={{
                               height: 150,
                               opacity: 1,
                               transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                               filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))',
                               '&:hover': {
                                 transform: 'translateY(-10px)',
                                 boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                               },
                             }}
                           />
                           </Box>
          <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 4 }}>
            <Typography><strong>Pass Year:</strong> {selectedAlumni.passYear}</Typography>
            <Typography><strong>Description:</strong> {selectedAlumni.description}</Typography>

            {selectedAlumni?.educationList?.map((edu, i) => (
              <Typography key={i} sx={{ mt: 1 }}>
                <strong>Education {i + 1}:</strong> {edu.degree} @ {edu.institute}
              </Typography>
            ))}

            {selectedAlumni?.resumeUrl && (
              <Typography sx={{ mt: 2 }}>
                <strong>Resume: </strong>
                <Link href={selectedAlumni.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Download
                </Link>
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={handleBackClick}>
                Back
              </Button>
              <Button variant="contained" color="success">
                Connect
              </Button>
            </Box>
          </Box>
        </Container>
      ) : (
        <Container sx={{ pt: 10 }}>
          <Typography variant="h4" sx={{ mt: 5, textAlign: 'center' }}>
            Welcome to Alumni Connect Portal {username}!
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            "Explore, Connect And Mentor"
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box
              component="img"
              src={logoImage}
              alt="imagi"
              sx={{
                height: 350,
                opacity: 1,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                },
              }}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              Connect With Fellow Alumni
            </Typography>
            <Box
              sx={{
                overflowY: 'auto',
                maxHeight: '500px',
                pr: 1,
                pb: 1,
              }}
            >
              <Grid container spacing={3} direction="column">
                {filteredAlumni.map((alumni, index) => (
                  <Grid item key={index}>
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderRadius: 3,
                        backgroundColor: '#fff',
                        boxShadow: 3,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <CardContent>
                     
                        <Typography variant="h6" fontWeight="bold">{alumni.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pass Year: {alumni.passYear}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          {alumni.description?.slice(0, 90) || 'No description'}...
                        </Typography>
                        {alumni.educationList.length > 0 && (
                          <Box mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              🎓 {alumni.educationList[0].degree} @ {alumni.educationList[0].institute}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      <Box textAlign="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setSelectedAlumni(alumni)}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default Home;
