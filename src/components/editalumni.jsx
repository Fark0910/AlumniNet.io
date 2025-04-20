import React, { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography, IconButton, Paper, Divider, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db } from '../firebase_set/firebase';

const EditAlumni = ({ name }) => {
  const [passYear, setPassYear] = useState("");
  const [educationList, setEducationList] = useState([{ degree: "", institute: "" }]);
  const [description, setDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(""); 
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "alumni", user.uid); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          
          setUserData(docSnap.data());
          setPassYear(docSnap.data().passYear);
          setEducationList(docSnap.data().educationList || [{ degree: "", institute: "" }]);
          setDescription(docSnap.data().description);
          setResumeUrl(docSnap.data().resumeUrl || ""); 
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, [auth, db]);

  const handleEducationChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const handleAddEducation = () => {
    setEducationList([...educationList, { degree: "", institute: "" }]);
  };

  const handleRemoveEducation = (index) => {
    const updated = [...educationList];
    updated.splice(index, 1);
    setEducationList(updated);
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "alumni", user.uid); 
      let uploadedResumeUrl = resumeUrl; 

      if (resume) {
       
        const storage = getStorage();
        const storageRef = ref(storage, `resumes/${resume.name}`);
        const uploadTask = uploadBytesResumable(storageRef, resume);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            
            uploadedResumeUrl = await getDownloadURL(uploadTask.snapshot.ref());
          }
        );
      }

      const data = {
        name: name,
        passYear: passYear,
        educationList: educationList,
        description: description,
        resumeUrl: uploadedResumeUrl, 
      };

   
      await setDoc(docRef, data, { merge: true }); 
      alert("Profile updated successfully!");
    }
  };

 
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ position: "relative", zIndex: 2, px: 2, py: 8 }}>
      <Container maxWidth="md" sx={{ pt: 10, pb: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3}}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Edit Alumni Profile
          </Typography>

          <TextField
            label="Name"
            fullWidth
            value={name}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Passout Year"
            fullWidth
            type="number"
            value={passYear}
            onChange={(e) => setPassYear(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
            Educational Details
          </Typography>
          {educationList.map((edu, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Degree"
                fullWidth
                value={edu.degree}
                onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
              />
              <TextField
                label="Institute"
                fullWidth
                value={edu.institute}
                onChange={(e) => handleEducationChange(idx, "institute", e.target.value)}
              />
              <IconButton
                onClick={() => handleRemoveEducation(idx)}
                disabled={educationList.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddEducation}
            sx={{ mb: 3 }}
          >
            Add More Education
          </Button>

          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Short Description"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
          >
            {resume ? "Resume Selected: " + resume.name : "Upload Resume"}
            <input type="file" hidden onChange={handleResumeUpload} />
          </Button>

          <Divider sx={{ mb: 3 }} />

          <Box textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditAlumni;
