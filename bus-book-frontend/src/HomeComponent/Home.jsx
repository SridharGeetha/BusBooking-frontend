import React, { useEffect, useState } from 'react'
import '/src/css/home.css'
import { Main } from './Main'
import { getBusById, getBusStop, isAuthenticated } from '../Service/service';



import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51QrBI7KitjAg8EXYAjXa2KoNdhoRvNG32SokBFmS0BjDLJICiGnTxB9loXnWhFLKvnOinrYZFxG0gX6pBYcoBgfs00QSnIvB8V');

  export const Home = () => {
    const [busId , setBusId] =  useState();
    const [busData , setBusData] =  useState();
    const[busStopData,setbusStopData] = useState([]);
    const [startingPoint, setStartingPoint] = useState("");
    const [endingPoint, setEndingPoint] = useState("");
    const [calculatedFare, setCalculatedFare] = useState(0);
    const[qty,setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if(!busId) return

      const fetchBusStops = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await getBusStop(token, busId);
          console.log(response);
          if (response) {
            console.log(busStopData)
            setbusStopData(response);
          } else {
            console.log("Error fetching bus stops");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
  
      fetchBusStops();
    },[busId])

    const handleSearchBus=async(e)=>{
      // console.log(isAuthenticated);
      if(isAuthenticated() != true){
        alert("Please Login First")
      }
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        // console.log(token)
        const busData  =  await getBusById(token,busId)
        setBusData(busData);
        // console.log(busData)
      } catch (error) {
        console.log(error)
        setBusData(null)
      }
    }
    useEffect(() => {
      if (startingPoint && endingPoint && busStopData.length > 0) {
        if (startingPoint === endingPoint) {
          setCalculatedFare(0);
        } else {
          const startStop = busStopData.find((stop) => stop.stopName === startingPoint);
          const endStop = busStopData.find((stop) => stop.stopName === endingPoint);
  
          if (startStop && endStop) {
            const fareDifference = qty*( Math.abs(endStop.fareFromStart - startStop.fareFromStart));
            setCalculatedFare(fareDifference);
          }
        }
      }
    }, [startingPoint, endingPoint, busStopData,qty]);

    const handlePayment = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        // Call backend API
        const response = await axios.post(
          'http://localhost:8080/user/payment',
          { amount: calculatedFare, qty: qty },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const stripe = await stripePromise;
        const session = response.data;
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId, 
        });
  
        if (result.error) {
          alert(result.error.message);
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Failed to initiate payment.');
      } finally {
        setLoading(false);
      }
    };
  
  
    return (
      <>
      <Main></Main>
      <div className="content">
          <div className="search-box">
            <input type="text" placeholder="Search Bus"
            onChange={(e)=>setBusId(e.target.value)}
            />
            <button onClick={handleSearchBus}>Search</button>
          </div>
          <div className='route-div'>
            <h2 className='route'>Route : <span className="route-name">{busData ? busData.route : 'No Route'}</span></h2>
          </div>
          <div className="form-container">
         <div className="form-group">
           <label htmlFor="starting-point">Starting Point :</label>
           <select id="starting-point" onChange={(e)=>setStartingPoint(e.target.value)}>
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
           <label htmlFor="ending-point">Ending Point :</label>
           <select id="ending-point" onChange={(e)=>setEndingPoint(e.target.value)}>
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
       <div>
        <input type="number"  onChange={(e)=>setQty(e.target.value)}/>
       </div>
       <div className='amount'>
       ${calculatedFare}
       </div>
       <div>
       <button className="pay-button" onClick={handlePayment}>Pay Now</button>
       </div>
      </div>
      </>
    )
  }
