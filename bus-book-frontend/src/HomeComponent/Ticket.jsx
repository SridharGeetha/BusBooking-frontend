import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export const Ticket = () => {
    const [searchParams] = useSearchParams();
    const [ticketDetails, setTicketDetails] = useState(null);
    
    const sessionId = searchParams.get("session_id");
    const busId = searchParams.get("busId");
    const startPoint = searchParams.get("startPoint");
    const destination = searchParams.get("destination");
    const qty = searchParams.get("qty");
    const userId = searchParams.get("userId");

    useEffect(() => {
        const token = localStorage.getItem('token')     
           if (sessionId) {
            axios.post("http://localhost:8080/user/booking-ticket", null, {
                params: {
                    userId,
                    busId,
                    startPoint,
                    destination,
                    ticket: qty
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            .then(response => {
                setTicketDetails(response.data);
            })
            .catch(error => {
                console.error("Error generating ticket:", error);
            });
        }
    }, [sessionId]);

    if (!ticketDetails) {
        return <h2>Generating your ticket...</h2>;
    }

    return (
        <div>
            <h2>🎟️ Ticket Confirmation</h2>
            <p><strong>Name:</strong> {ticketDetails.name}</p>
            <p><strong>From:</strong> {ticketDetails.source}</p>
            <p><strong>To:</strong> {ticketDetails.destination}</p>
            <p><strong>Fare:</strong> ${ticketDetails.fare}</p>
            <p><strong>Date:</strong> {ticketDetails.bookingDate}</p>
            <p><strong>Time:</strong> {ticketDetails.bookingTime}</p>
            <p><strong>Booking ID:</strong> {ticketDetails.bookingId}</p>
        </div>
    );
};

