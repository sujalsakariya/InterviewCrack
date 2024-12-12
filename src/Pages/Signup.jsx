import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        // Perform signup action
        const { name, email, password } = values;

        if (password !== values.confirmPassword) {
          console.log('Passwords do not match!');
          return;
        }

        let res = await axios.post(
          'https://interviewhub-3ro7.onrender.com/admin/signup',
          { name, email, password }
        );
        console.log(res.data);

        // Redirect to the login page or home page
        navigate('/admin/login');
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            width: '500px',
            border: '3px solid #1976D2',
            padding: '40px 30px',
            borderRadius: '20px',
          }}
          className="d-flex flex-column align-items-center gap-3"
        >
          <Typography variant="h4" sx={{ color: '#1976D2' }}>
            Signup
          </Typography>

          {/* Name field */}
          <TextField
            id="name"
            fullWidth
            label="Full Name"
            variant="outlined"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />

          {/* Email field */}
          <TextField
            id="email"
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />

          {/* Password field */}
          <TextField
            id="password"
            fullWidth
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />

          {/* Confirm Password field */}
          <TextField
            id="confirmPassword"
            fullWidth
            label="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />

          <Button variant="contained" fullWidth type="submit">
            Signup
          </Button>
          <Box>
            you have already an account   <Link to="/">Login</Link>  
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;