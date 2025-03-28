import axios from "axios";

// Crea un'istanza di axios per Hugging Face
const apiHuggingFace = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Funzione per generare immagini con Stable Diffusion
export const generateImageWithStableDiffusion = async (prompt) => {
  try {
    // Stable Diffusion 2.1 è un buon modello gratuito
    const response = await apiHuggingFace.post('/stabilityai/stable-diffusion-2-1', {
      inputs: prompt,
      parameters: {
        num_inference_steps: 30,
        guidance_scale: 7.5
      }
    }, {
      responseType: 'arraybuffer' // Riceviamo l'immagine come array buffer
    });
    
    // Converti il buffer in base64 per poterlo visualizzare
    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    return {
      output_url: `data:image/jpeg;base64,${base64}`,
      model: 'stable-diffusion-2-1'
    };
  } catch (error) {
    console.error("Errore durante la generazione dell'immagine:", error);
    throw error;
  }
};

// Funzione per upscaling immagini con modello ESRGAN
export const enhanceImageResolution = async (imageBase64) => {
  try {
    // Estrai la parte base64 dall'URL data:image
    const base64Image = imageBase64.split(',')[1];
    
    // Converti base64 in Uint8Array
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Invia la richiesta al modello di upscaling
    const response = await apiHuggingFace.post('/nightmareai/real-esrgan', bytes, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
    
    // Converti il buffer in base64 per poterlo visualizzare
    const enhancedBase64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    return {
      output_url: `data:image/jpeg;base64,${enhancedBase64}`,
      model: 'real-esrgan'
    };
  } catch (error) {
    console.error("Errore durante il miglioramento dell'immagine:", error);
    throw error;
  }
};

// Funzione per generare video con ModelScope Text2Video
export const generateVideo = async (prompt, numFrames = 16) => {
  try {
    const response = await apiHuggingFace.post('/damo-vilab/text-to-video-ms-1.7b', {
      inputs: prompt,
      parameters: {
        num_inference_steps: 25,
        num_frames: numFrames
      }
    }, {
      responseType: 'arraybuffer'
    });
    
    // Converti il buffer in base64
    const base64 = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    
    // I modelli text-to-video in genere restituiscono un file MP4
    return {
      output_url: `data:video/mp4;base64,${base64}`,
      model: 'text-to-video-ms-1.7b'
    };
  } catch (error) {
    console.error("Errore durante la generazione del video:", error);
    throw error;
  }
};