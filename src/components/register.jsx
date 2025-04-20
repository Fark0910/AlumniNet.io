import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authContainer } from '../styles/authStyles';
import BackgroundVideo from './BackgroundVideo';
import { auth } from '../firebase_set/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import logoImage from '../assets/We.png'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (email && name && password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User Registered');
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          navigate('/register');
        }, 1000);
      } else {
        alert('Please fill all fields!!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <BackgroundVideo />

      <Container
        maxWidth="xs"
        sx={{
          ...authContainer,
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: 4,
          padding: 4,
          mt: 8,
          boxShadow: 3,
        }}
      >
     
        

        <Typography variant="h5" gutterBottom>
          Alumni Registeration
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logoImage} alt="Logo" style={{ width: '100%', height: 'auto',borderRadius: '5%' }} />
        </Box>

        <TextField fullWidth label="Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography mt={2} align="center">
          Already have an account?{' '}
          <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Login
          </span>
        </Typography>
      </Container>
    </>
  );
};

export default Register;
