import axios from "axios";

// create an instance of axios
const axiosInstance = axios.create({
        baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
        withCredentials:true, //send cookies to the server.
})

export default axiosInstance;