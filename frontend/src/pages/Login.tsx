import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../Context/authContext';

function Login() {
    const [form,setForm] = useState({
        email:'',
        password:''
    });
    const navigate = useNavigate();
    const {setIsAuthenticated,isAuthenticated,setUser} = useAuthContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        // check if user is already authenticated
        console.log(form)
        
        await axios.post('http://localhost:8000/api/v1/users/login',form).then((response)=>{
            if(response.status === 200){
                //check for access token
                
                const accessToken = response.data.accessToken;
                if(accessToken){
                  localStorage.setItem('accessToken', accessToken);
                }

                const userData ={
                  id: response.data.data.user._id,
                  fullName: response.data.data.user.fullName,
                  email: response.data.data.user.email,
                  role: response.data.data.user.role
                }
                 // set user data in local storage
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('User data saved to localStorage:', localStorage.getItem('user'));
                // set user data in context
                setUser(userData);
                // set authentication state
                setIsAuthenticated(true);

                console.log('Registration successful:', response.data);
                // Redirect to dashboard
                navigate('/dashboard');

          

            }
        }).catch((error)=>{
            console.error('Error during registration:', error.response?.data || error.message);
            // Handle error (e.g., show a notification)
            alert('Login failed. Please check your credentials and try again.');
        })
    }

  return (
     <StyledWrapper>
      <motion.div
        className="form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">Login</h1>
        <p className="subtitle">Login now and get full access to our app.</p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <motion.button
            className="submit-btn"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </form>

        <p className="signin-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </motion.div>
    </StyledWrapper>
  )
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;

  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #4F46E5;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subtitle {
    color: #6B7280;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .name-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .input-group {
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #4F46E5;
      }

      &::placeholder {
        color: #9CA3AF;
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #4338CA;
    }
  }

  .signin-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #6B7280;

    a {
      color: #4F46E5;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Login