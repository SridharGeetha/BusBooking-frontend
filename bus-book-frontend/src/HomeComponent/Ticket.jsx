import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Skeleton,
  Divider,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";


export const Ticket = () => {
  const [searchParams] = useSearchParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const busId = searchParams.get("busId");
  const startPoint = searchParams.get("startPoint");
  const destination = searchParams.get("destination");
  const qty = searchParams.get("qty");
  const userId = searchParams.get("userId");


  // const token = sessionStorage.getItem('token');
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Local Storage Contents:", JSON.stringify(localStorage));
    console.log("token",token)
    if (!token) {
      console.error("Token is missing! Please check localStorage.");
      return;
    }
    const bookedSession = localStorage.getItem(`booked_${sessionId}`); 
  
    if (bookedSession) {
      setTicketDetails(JSON.parse(bookedSession));  
      setLoading(false);
    } else if (sessionId) {
      axios
        .post(
          "http://localhost:8080/user/booking-ticket",
          null,
          {
            params: {
              userId,
              busId,
              startPoint,
              destination,
              ticket: qty,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setTicketDetails(response.data);
          setLoading(false);
          localStorage.setItem(`booked_${sessionId}`, JSON.stringify(response.data));  // Store data in localStorage
        })
        .catch((error) => {
          console.error("Error generating ticket:", error);
          setLoading(false);
        });
    }
  }, [sessionId]);
  

  return (
    <Card className="no-screenshot"
    
      variant="outlined"
      sx={{
        width: 400,
        mx: "auto",
        my: 4,
        borderRadius: 2,
        boxShadow: 3,
        padding: 2,
        position: "relative",
        bgcolor: "white",
        fontFamily: "'Courier New', monospace", // Ticket-style font
      }}
    >
      <ConfirmationNumberIcon
        sx={{
          fontSize: 50,
          color: "black",
          position: "absolute",
          top: -15,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "white",
          borderRadius: "50%",
        }}
      />
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={500}
          align="center"
          sx={{ fontFamily: "'Courier New', monospace" }}
        >
           Ticket Confirmation
        </Typography>
        <Divider sx={{ my: 1, bgcolor: "black" }} />

        {loading ? (
          <>
            <Skeleton height={30} width="80%" />
            <Skeleton height={25} width="60%" />
            <Skeleton height={25} width="70%" />
            <Skeleton height={25} width="50%" />
            <Skeleton height={25} width="90%" />
            <Skeleton height={25} width="80%" />
            <Skeleton height={25} width="40%" />
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              Name:{ticketDetails.name}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              From: {ticketDetails.source}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
             To: {ticketDetails.destination}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              Ticket: {ticketDetails.qty}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              fare: ₹{ticketDetails.fare}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
             Date:{ticketDetails.bookingDate}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              Time: {ticketDetails.bookingTime}
            </Typography>
            <Typography
              variant="body1"
              fontWeight={400}
              sx={{ fontFamily: "'Courier New', monospace" }}
            >
              Booking ID: {ticketDetails.bookingId}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
