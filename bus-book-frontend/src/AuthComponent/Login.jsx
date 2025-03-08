import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { iaUser, isAdmin, login } from '../Service/service';
import Link from '@mui/joy/Link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleSignup = ()=>{
    navigate("/signup")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setEmailError(false);
    // setPasswordError(false);
    // setError('');

    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);
    if (!email || !password) return;

    try {
      const userData = await login(email, password);
      console.log(userData);
      if(userData.statusCode === 500){
        setError('Invalid email or password.');
        console.error('Login error:', err);
      }
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('id', userData.userId);
        localStorage.setItem('username', userData.username);

        if (userData.role == "ADMIN") {
          navigate('/admin')
        } else if(iaUser()){
          navigate('/')
        }
      }
    } catch (err) {
      setError('Invalid email or password.');
      console.error('Login error:', err);
    }
  };

  return (
    <Stack spacing={3} sx={{ width: 300, margin: 'auto', mt: 8, p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 3 }}>
      <h2>Login</h2>

      {error && <Alert color="danger">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <FormControl error={emailError}>
          <FormLabel>Email</FormLabel>
          <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError && (
            <FormHelperText>
              <InfoOutlined />
              Email is required.
            </FormHelperText>
          )}
        </FormControl>

        <FormControl error={passwordError} sx={{ mt: 2 }}>
          <FormLabel>Password</FormLabel>
          <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordError && (
            <FormHelperText>
              <InfoOutlined />
              Password is required.
            </FormHelperText>
          )}
        </FormControl>

        <Button type="submit" variant="solid" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
          Login
        </Button>
        <FormLabel sx={{ paddingTop: '8px' }}>
              Don't have an Account ? <Link onClick={handleSignup}>Sign up</Link>
            </FormLabel>
      </form>
    </Stack>
  );
};

export default Login;
