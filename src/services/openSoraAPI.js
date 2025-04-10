// services/openSoraAPI.js
import { Client } from "@gradio/client";

export const generateVideoWithOpenSora = async (prompt) => {
    try {
      console.log("Inizio generazione video con Open-Sora, prompt:", prompt);
      
      const response = await fetch(
        "https://claudiobxdai-sora.hf.space/api/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: [prompt]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Risposta da Open-Sora:", result);
      
      // La risposta dovrebbe essere in formato: { data: [stato, videoUrl] }
      const [stato, videoUrl] = result.data;
      
      return {
        output_url: videoUrl,
        model: "open-sora",
        status: stato
      };
    } catch (error) {
      console.error("Errore durante la generazione del video con Open-Sora:", error);
      throw error;
    }
  };