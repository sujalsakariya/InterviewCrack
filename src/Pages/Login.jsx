import React, { useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GridLoader, HashLoader } from 'react-spinners';


const Login = () => {
  const [spinner , setspinner] = useState(false)
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: 'jd@gmail.com',
      password: 'jd@123',
    },
    onSubmit: async (values) => {
      try {
        setspinner(true)
        let res = await axios.post("https://interviewhub-3ro7.onrender.com/admin/login", values)
        localStorage.setItem("token", res.data.token)
        navigate("/admin/")
        // console.log(res.data.token); 
      } catch (error) {
        console.log(error);
      }
      
    },
  });
  useEffect(() => {
    if(localStorage.getItem('token')){
      navigate('/admin/')
    }
  },[])
  return (
    spinner?<Box sx={{width:'100%', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}><Box><HashLoader color="#122dff" /></Box></Box>:<Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ width: '500px', border: '3px solid #1976D2', padding: '40px 30px', borderRadius: '20px' }} className="d-flex flex-column align-items-center gap-3">

          <Typography variant='h4' sx={{ color: '#1976D2' }}>Login</Typography>
          <TextField
            id="outlined-basic"
            fullWidth label="Email"
            variant="outlined"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <TextField
            id="outlined-basic"
            fullWidth label="Password"
            variant="outlined"
            name="password"
            type='password'
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <Button variant='contained' fullWidth type="submit">Login</Button>
          <Box>
            you don't have any account   <Link to="/signup">Signup</Link>
          </Box>
        </Box>
      </form>
    </Box >
  )
}

export default Login