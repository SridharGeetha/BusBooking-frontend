import React, { useEffect, useState } from 'react';
import '/src/css/home.css';
import { Main } from './Main';
import { getBusById, getBusStop, isAuthenticated } from '../Service/service';
import {
  Button,
  Typography,
  Select,
  Option,
  Input,
  CircularProgress,
  Alert,
} from '@mui/joy';
import NoTransferIcon from '@mui/icons-material/NoTransfer';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51QrBI7KitjAg8EXYAjXa2KoNdhoRvNG32SokBFmS0BjDLJICiGnTxB9loXnWhFLKvnOinrYZFxG0gX6pBYcoBgfs00QSnIvB8V');

export const Home = () => {
  const [busId, setBusId] = useState();
  const [busData, setBusData] = useState();
  const [busStopData, setbusStopData] = useState([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [calculatedFare, setCalculatedFare] = useState(0);
  const [fare, setFare] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!busId) return;

    const fetchBusStops = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getBusStop(token, busId);
        if (response) {
          console.log(busStopData);
          setbusStopData(response);
        } else {
          console.log("Error fetching bus stops");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBusStops();
  }, [busId]);

  const handleSearchBus = async (e) => {
    if (!isAuthenticated()) {
      alert("Please Login First");
      return;
    }
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const busData = await getBusById(token, busId);
      setBusData(busData);
    } catch (error) {
      console.log(error);
      setBusData(null);
    }
  };

  useEffect(() => {
    if (startingPoint && endingPoint && busStopData.length > 0) {
      if (startingPoint === endingPoint) {
        setCalculatedFare(0);
      } else {
        const startStop = busStopData.find((stop) => stop.stopName === startingPoint);
        const endStop = busStopData.find((stop) => stop.stopName === endingPoint);

        if (startStop && endStop) {
          const fare = Math.abs(endStop.fareFromStart - startStop.fareFromStart);
          setFare(fare);
          setCalculatedFare(qty * fare);
        }
      }
    }
  }, [startingPoint, endingPoint, busStopData, qty]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      const response = await axios.post(
        "http://localhost:8080/user/payment",
        null,
        {
          params: { amount: fare, qty, busId, startingPoint, endingPoint, userId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const stripe = await stripePromise;
      const session = response.data;
      const result = await stripe.redirectToCheckout({ sessionId: session.sessionId });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Main />
      <div className="content" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="search-box">
          <input type="text" placeholder="Search Bus" onChange={(e) => setBusId(e.target.value)} />
          <button onClick={handleSearchBus}>
            Search
          </button>
        </div>

        <div className="route-div">
          <h2 level="h2" className="route">
            <span className="route-name">{busData ?(" Route :"+busData.route ): <NoTransferIcon sx={{marginTop:'20px'}}/>}</span>
          </h2>
        </div>

        <div className="form-container">
          <div className="form-group">
            <Typography level="body-md" component="label" htmlFor="starting-point">
              Starting Point :
            </Typography>
            <select id="starting-point" onChange={(e) => setStartingPoint(e.target.value)}>
              <option value="">Source</option>
              {busStopData.length > 0 ? (
                busStopData.map((busStop) => (
                  <option key={busStop.stopId} value={busStop.stopName}>
                   {busStop.stopName}
                  </option>
                ))
              ) : (
                <option disabled>No Stops Available</option>
              )}
            </select>

          </div>

          <div className="form-group">
            <Typography level="body-md" component="label" htmlFor="ending-point">
              Ending Point :
            </Typography>
            <select id="ending-point" onChange={(e) => setEndingPoint(e.target.value)}>
              <option value="">Destination</option>
              {busStopData.length > 0 ? (
                busStopData.map((busStop) => (
                  <option key={busStop.stopId} value={busStop.stopName}>
                   {busStop.stopName}
                  </option>
                ))
              ) : (
                <option disabled>No Stops Available</option>
              )}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Input
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            min={1}
            sx={{ width: '120px' }}
          />
          </div>

        <div >
        <Typography level="body-lg" sx={{ alignSelf: 'center' }}>
            Total Fare: <strong>₹{calculatedFare}</strong>
          </Typography>
        </div>

        <div className="pay-button-div">
        <Button
            variant="soft"
            color="primary"
            onClick={handlePayment}
            disabled={!startingPoint || !endingPoint || calculatedFare <= 0 || loading}
            sx={{ width: '150px' }}
          >
            {loading ? <CircularProgress size="sm" /> : '₹ Pay Now'}
          </Button>
        </div>
      </div>
    </>
  );
};
