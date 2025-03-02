import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Typography,
  FormControl,
  FormHelperText,
  Link,
  Box,
} from "@mui/joy";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";
    if (!password.trim()) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const userData = { username, email, password };
      localStorage.setItem("user", JSON.stringify(userData));
      alert("Signup successful! Please login.");
      navigate("/login"); 
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: "lg",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <Typography level="h3" sx={{ mb: 2 }}>
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit}>
        
        <FormControl error={!!error.username}>
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error.username && (
            <FormHelperText>{error.username}</FormHelperText>
          )}
        </FormControl>

        
        <FormControl error={!!error.email} sx={{ mt: 2 }}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <FormHelperText>{error.email}</FormHelperText>}
        </FormControl>

     
        <FormControl error={!!error.password} sx={{ mt: 2 }}>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <FormHelperText>{error.password}</FormHelperText>
          )}
        </FormControl>

       
        <Button type="submit" variant="soft" sx={{ mt: 3, width: "100%" }}>
          Sign Up
        </Button>

       
        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link href="/login" sx={{ fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Signup;
