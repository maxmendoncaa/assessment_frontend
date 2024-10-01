import axios from "axios";
import Cookies from "js-cookie";


const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    headers: {
        'Content-Type' : 'application/json',
        'Authorization' : "Bearer "+Cookies.get('token')
        
    }
});

export default axiosInstance;