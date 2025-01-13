import axios from 'axios';

const itemsPerPageOptions = { type: Number, default: 10 };
// TODO change to production URL
const serverURL = 'http://localhost:3050'

const axiosInstance = axios.create({
	baseURL: serverURL
})

export { itemsPerPageOptions, axiosInstance };
