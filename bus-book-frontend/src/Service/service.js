import axios from "axios";
const BASE_URL = "http://localhost:8080";

export const login =async(email,password)=>{
    try {
        const response = await axios.post(BASE_URL+"/auth/login",{email,password});
        return response.data;
    } catch (error) {
        throw error
    }
    }

const register =async(userData)=>{
    try {
        const response = await axios.post(BASE_URL+"/auth/add-new-user",userData,{
            headers: {
              'Content-Type': 'application/json'
            }
          });
        return response.data;
    } catch (error) {
        throw error
    }
}

const getBusById =async(token,id)=>{

    try {
        const response = await axios.get(`${BASE_URL}/adminuser/get-bus/${id}`,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw error
        }
    }
const getBusStop =async(token,busId)=>{

    try {
        const response = await axios.get(`${BASE_URL}/adminuser/busStops/${busId}`,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw error
        }
    }   
    const getAllBusData =async(token)=>{
        
        try {
            const response = await axios.get(`${BASE_URL}/adminuser/get-all-bus`,{
                headers: {Authorization: `Bearer ${token}`}
            });
            return response.data;
        } catch (error) {
            throw error
        }
    }

    const AddNewBus = async (busId,route, startPoint, destination, totalFare, token) => {
        try {
          const formData = new FormData();
          formData.append("busId",busId)
          formData.append("route",route);
          formData.append("startPoint",startPoint);
          formData.append("destination",destination);
          formData.append("totalFare",totalFare);
      
          const response = await axios.post(`${BASE_URL}/admin/add-new-bus`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              
            }
          });
      
          return response.data;
        } catch (error) {
          throw error;
        }
      };
      
    const AddbusStop=async(stopName,fare,busId ,token)=>{
        try {
            const formData = new FormData();
            formData.append("busId",busId)
            formData.append("stopName",stopName)
            formData.append("fare",fare)
            const response = await axios.post(`${BASE_URL}/admin/add-new-bus-stop`,formData,{
            headers: {Authorization: `Bearer ${token}`}
            })
            return response.data;
            
        } catch (error) {
            throw error
        }
    }



    // payment
const payment =async(token,qty,amount)=>{
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("qty", qty);
    try {
        const response = await axios.post(`${BASE_URL}/user/payment`,formData,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw error
        }
    }

    const payAmount = async(token , qty , amount)=>{
        const formData = new FormData();
        formData.append("amount", amount);
        formData.append("qty", qty);
        try {
          const response = await axios.post(`${BASE_URL}/user/payment`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
        } catch (error) {
          throw error;
        }
    }

const generateFare =async(token, source,destination,ticket)=>{
    const formData = new FormData();
    formData.append("source", source);
    formData.append("destination", destination);
    formData.append("ticket", ticket);
    try {
        const response = await axios.get(`${BASE_URL}/adminuser/get-fare`,formData,{
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw error
        }
    }

      


    // Auth Function

    const isAuthenticated=()=>{
        const token = localStorage.getItem('token')
        return !!token
    }

    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('username');
    }

const isAdmin = () => {
    const role = localStorage.getItem('role');
        if(role === 'ADMIN'){
            return true;
        }else{
            return false;
        }
    };
const notAdmin = () => {
    const role = localStorage.getItem('role');
        if(role != 'ADMIN'){
            return true;
        }else{
            return false;
        }
    };
    const iaUser = ()=>{
        const role = localStorage.getItem('role');
        return role == 'USER'
    }

export  {register,
    getBusById,
    isAuthenticated,
    isAdmin,
    iaUser,
    logout,
    notAdmin,
    getBusStop,
    payAmount,
    generateFare,
    getAllBusData,
    AddNewBus,
    AddbusStop,
    payment
};