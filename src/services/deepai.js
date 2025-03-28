import axios from "axios";

// Crea un'istanza di axios per DeepAI
const apiDeepAI = axios.create({
  baseURL: 'https://api.deepai.org/api',
  headers: {
    'api-key': 'VITE_DEEPAI_API_KEY' // Sostituisci con la tua API key
  }
});

// Funzione per generare immagini con text-to-image
export const generateImage = async (text) => {
  try {
    const formData = new FormData();
    formData.append('text', text);
    
    const response = await apiDeepAI.post('/text2img', formData);
    return response.data;
  } catch (error) {
    console.error("Errore durante la generazione dell'immagine:", error);
    throw error;
  }
};

// Funzione per migliorare la risoluzione di un'immagine
export const enhanceImage = async (imageUrl) => {
  try {
    const formData = new FormData();
    formData.append('image', imageUrl);
    
    const response = await apiDeepAI.post('/super-resolution', formData);
    return response.data;
  } catch (error) {
    console.error("Errore durante il miglioramento dell'immagine:", error);
    throw error;
  }
};

// Funzione per generare un video da un testo (simulato)
// Nota: DeepAI non ha una API diretta per text-to-video
// Qui potremmo integrare altre API come Hugging Face per questa funzionalità
export const generateVideo = async (text) => {
  try {
    // Simuliamo una chiamata API
    // In un'implementazione reale, chiameremmo un endpoint per text-to-video
    const mockResponse = {
      id: Date.now().toString(),
      status: 'processing',
      prompt: text,
      output_url: null
    };
    
    return mockResponse;
  } catch (error) {
    console.error("Errore durante la generazione del video:", error);
    throw error;
  }
};