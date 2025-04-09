export const generateVideoWithOpenSora = async (prompt) => {
  try {
    // Sostituisci con l'URL fornito da Gradio
    const GRADIO_URL = "https://xxxx.gradio.live"; // Cambia questo con l'URL reale
    
    const response = await fetch(
      `${GRADIO_URL}/api/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [
            prompt,          // Prompt
            "832*480",       // Resolution
            50,              // Diffusion steps
            6.0,             // Guide scale
            8.0,             // Shift scale
            -1,              // Seed (-1 = random)
            ""               // Negative prompt
          ]
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    
    // L'URL del video generato è nel campo output
    const videoUrl = `${GRADIO_URL}/file=${result.data}`;
    
    return {
      output_url: videoUrl,
      model: "wan2.1-t2v-1.3b",
      status: "completed"
    };
  } catch (error) {
    console.error("Errore durante la generazione del video con Wan2.1:", error);
    throw error;
  }
};