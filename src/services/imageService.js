import axios from "axios";

// URL del backend (cambia in base all'ambiente)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Crea un'istanza di axios per il nostro backend
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Genera un'immagine usando Stable Diffusion tramite il nostro backend
 * @param {string} prompt - Descrizione testuale dell'immagine da generare
 * @param {Object} options - Opzioni aggiuntive come guidanceScale e numInferenceSteps
 * @returns {Promise<Object>} - Promise con il risultato
 */
export const generateImage = async (prompt, options = {}) => {
  try {
    // Assicuriamoci che il prompt sia una stringa
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Il prompt deve essere una stringa non vuota');
    }
    
    const { 
      guidanceScale = 7.5, 
      numInferenceSteps = 30,
      negativePrompt = "bassa qualità, sfocato, distorto, pixelato"
    } = options;
    
    // Converti in numeri se necessario
    const processedOptions = {
      guidanceScale: Number(guidanceScale),
      numInferenceSteps: Number(numInferenceSteps),
      negativePrompt
    };
    
    console.log(`Generazione immagine con prompt: "${prompt}"`);
    
    const response = await apiClient.post('/api/generate-image', {
      prompt,
      options: processedOptions
    });
    
    return response.data;
  } catch (error) {
    console.error("Errore durante la generazione dell'immagine:", error);
    throw error;
  }
};

/**
 * Migliora la risoluzione di un'immagine
 * @param {string} imageBase64 - Immagine in formato base64
 * @returns {Promise<Object>} - Promise con il risultato
 */
export const enhanceImageResolution = async (imageBase64) => {
  try {
    const response = await apiClient.post('/api/enhance-image', {
      imageBase64
    });
    
    return response.data;
  } catch (error) {
    console.error("Errore durante il miglioramento dell'immagine:", error);
    throw error;
  }
};

/**
 * Controlla lo stato dell'API
 * @returns {Promise<Object>} - Promise con lo stato dell'API
 */
export const checkApiStatus = async () => {
  try {
    const response = await apiClient.get('/api/status');
    return response.data;
  } catch (error) {
    console.error("Errore durante il controllo dello stato dell'API:", error);
    return { 
      status: 'offline', 
      message: 'API non disponibile', 
      error: error.message 
    };
  }
};

// Modelli disponibili per la generazione di immagini
export const availableModels = [
  { 
    id: 'stable-diffusion-2-1', 
    name: 'Stable Diffusion 2.1', 
    provider: 'Hugging Face',
    description: 'Modello di base per la generazione di immagini di alta qualità'
  },
  { 
    id: 'runwayml/stable-diffusion-v1-5', 
    name: 'Stable Diffusion 1.5', 
    provider: 'Hugging Face',
    description: 'Versione precedente di Stable Diffusion, utile per stili artistici'
  },
  { 
    id: 'stabilityai/stable-diffusion-xl-base-1.0', 
    name: 'Stable Diffusion XL', 
    provider: 'Hugging Face',
    description: 'Versione avanzata con maggiore qualità (richiede più risorse)'
  }
];