import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authContainer } from '../styles/authStyles';
import BackgroundVideo from './BackgroundVideo'; // adjust path if needed
import { auth } from '../firebase_set/firebase';
import logoImage from '../assets/We.png'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
        if (email && password) {
           const userCredential = await signInWithEmailAndPassword(auth, email, password);
           const usern = userCredential.user;
           const usernew=usern.displayName
           //console.log("You are in!!")
           //console.log('User Email:', user.email);
           //console.log('Username (DisplayName):', user.displayName); 
           //console.log('UID:', user.uid);
             
           setEmail('');
           setPassword('');
           setTimeout(()=>{           
             navigate("/home",{state:{username:usernew}});
                        
           },1000)
        }
        else{
            alert('fill all fields')
        }
    
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
    <BackgroundVideo />

    <Container maxWidth="xs" sx={authContainer}>
      
      <Typography variant="h5" gutterBottom>Alumni Login</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logoImage} alt="Logo" style={{ width: '100%', height: 'auto', borderRadius: '5%' }} />
      </Box>
      <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
      <Typography mt={2}>
        Don't have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
      </Typography>
    </Container>
    </>
  );
};

export default Login;
