import axios from "axios";

const apiUnsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_API_KEY}`
  }
});