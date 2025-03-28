import axios from "axios";

// API url per StableDiffusionAPI
const STABLEDIFFUSION_API_URL = 'https://stablediffusionapi.com/api/v5/text2video';

// Funzione per generare video con l'API ufficiale di Stable Diffusion
export const generateVideoWithStableDiffusionAPI = async (prompt, seconds = 3) => {
  try {
    // Verifica che l'API key sia presente
    const apiKey = import.meta.env.VITE_STABLEDIFFUSION_API_KEY;
    if (!apiKey) {
      throw new Error("API key di StableDiffusion non configurata. Controlla il file .env");
    }

    console.log("Inizio generazione video con StableDiffusionAPI, prompt:", prompt);
    
    // Prepara i parametri della richiesta
    const requestData = {
      key: apiKey,
      prompt: prompt,
      negative_prompt: "low quality, blurry, distorted, text, watermark, ugly",
      scheduler: "EulerAncestralDiscreteScheduler", // Schedulatore avanzato per migliore qualità
      seconds: seconds
    };
    
    // Esegui la chiamata API
    const response = await axios.post(
      STABLEDIFFUSION_API_URL,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Risposta StableDiffusionAPI:", response.data);

    // Controlla la risposta dell'API
    if (response.data.status === "success") {
      // L'API di StableDiffusion restituisce l'URL del video generato nell'array output
      const videoUrl = response.data.output[0];
      
      return {
        output_url: videoUrl,
        model: "stable-diffusion-text2video",
        generationTime: response.data.generationTime
      };
    } else if (response.data.status === "processing") {
      // In alcuni casi, l'API potrebbe richiedere più tempo e fornire un ID di elaborazione
      // Implementiamo il polling
      const fetchId = response.data.id || response.data.fetch_result;
      
      if (fetchId) {
        return await pollForResults(fetchId, apiKey);
      } else {
        throw new Error("Impossibile ottenere l'ID di elaborazione");
      }
    } else {
      // Se la risposta non è "success" né "processing", c'è stato un errore
      throw new Error(response.data.message || "Errore sconosciuto nell'API");
    }
  } catch (error) {
    console.error("Errore durante la generazione del video con StableDiffusionAPI:", error);
    throw error;
  }
};

// Funzione per il polling del risultato
const pollForResults = async (fetchId, apiKey) => {
  console.log("Inizio polling per l'ID:", fetchId);
  
  // URL per controllare lo stato dell'elaborazione
  const fetchURL = "https://stablediffusionapi.com/api/v4/dreambooth/fetch";
  
  // Numero massimo di tentativi
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Attendi 5 secondi tra i tentativi di polling
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      console.log(`Tentativo di polling ${attempts}/${maxAttempts}`);
      
      const response = await axios.post(
        fetchURL,
        {
          key: apiKey,
          request_id: fetchId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Risposta polling:", response.data);
      
      if (response.data.status === "success") {
        const videoUrl = response.data.output[0];
        return {
          output_url: videoUrl,
          model: "stable-diffusion-text2video",
          generationTime: response.data.generationTime || 0
        };
      } else if (response.data.status === "failed") {
        throw new Error("La generazione del video è fallita: " + (response.data.message || "Errore sconosciuto"));
      }
      
      // Se non è né success né failed, continuiamo il polling
    } catch (error) {
      console.error(`Errore durante il polling (tentativo ${attempts}):`, error);
      
      // Se l'errore è critico, interrompiamo il polling
      if (error.response && error.response.status >= 400 && error.response.status !== 429) {
        throw error;
      }
      
      // Altrimenti continuiamo con il prossimo tentativo
    }
  }
  
  // Se abbiamo raggiunto il numero massimo di tentativi, lanciamo un errore
  throw new Error("Timeout: il video non è stato completato nel tempo previsto");
};

// Funzione di fallback per simulare la generazione di video
export const generateVideoMock = async (prompt) => {
  console.log("Utilizzo simulazione per:", prompt);
  
  // Attendi 3 secondi per simulare il caricamento
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Lista di video di esempio
  const sampleVideos = [
    'https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/ee3e20f4-adf7-4cb2-9733-3c3b6bae8813.mp4',
    'https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/33d796d6-707d-41e3-9645-30d0b09ecfcd.mp4',
    'https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/ff68c569-15cd-4887-8d2c-8d71cb858b5e.mp4'
  ];
  
  // Scegli un video casuale
  const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
  
  return {
    output_url: randomVideo,
    model: "stable-diffusion-text2video-simulation",
    generationTime: 3.5
  };
};