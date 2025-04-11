// Replace src/services/videoService.js with this cleaner version
import axios from "axios";

// URL del backend (cambia in base all'ambiente)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Service mockup per la generazione di video
 * Questo servizio offre funzioni di fallback per quando le API reali non sono disponibili
 */

// Funzione mockup per generare video (modalità fallback/simulazione)
export const generateVideoMock = async (promptText, options = {}) => {
  // Simula un ritardo di elaborazione
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Array di video di esempio
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ];
  
  // Sceglie un video casuale
  const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
  
  return {
    output_url: randomVideo,
    download_video_url: randomVideo,
    download_gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHRwcG5ycnd6MzNsc2lyOHpuNHp6cHAycDIzbXpjYjEzczI0Z3NieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S6VGjvmFRu5Qk/giphy.gif",
    model: "video-simulation",
    status: "completed",
    seed_used: Math.floor(Math.random() * 1000),
    fallback: true
  };
};

// Funzione per aumentare la risoluzione di un video
export const enhanceVideoResolution = async (videoUrl) => {
  // Per ora, restituiamo lo stesso video
  // In futuro, qui implementeremo un servizio reale per migliorare la risoluzione
  return {
    output_url: videoUrl,
    enhanced: true
  };
};

// Opzioni per future integrazioni API
export const videoServiceProviders = {
  STABLE_DIFFUSION: 'stablediffusion',
  OPEN_SORA: 'opensora',
  WAN21: 'wan21',
  COGVIDEOX: 'cogvideox',
};

// Funzione per verificare se un'API è disponibile
export const checkVideoServiceAvailability = async (providerName) => {
  console.log(`Verifica disponibilità del provider ${providerName}...`);
  
  // Simulazione: tutti i provider tranne OpenSora sono disponibili
  return providerName !== videoServiceProviders.OPEN_SORA;
};