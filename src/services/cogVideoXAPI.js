// src/services/cogVideoXAPI.js
import axios from "axios";

// Flag per decidere se usare la versione diretta o il proxy server
const USE_PROXY = true;
const PROXY_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://videoai-backend.onrender.com"; // Cambia in base al tuo backend

/**
 * Generate a video using CogVideoX-5B-Space
 * @param {string} prompt - Text description for video generation
 * @param {Object} options - Additional options
 * @param {Blob|File} options.imageInput - Input image (will be cropped to 720 * 480)
 * @param {Blob|File} options.videoInput - Input video (will be cropped to 49 frames, 6 seconds at 8fps)
 * @param {number} options.videoStrength - Strength parameter (0-1), default: 0.8
 * @param {number} options.seedValue - Inference seed (-1 for random)
 * @param {boolean} options.scaleStatus - Super-Resolution (720 × 480 -> 2880 × 1920)
 * @param {boolean} options.rifeStatus - Frame Interpolation (8fps -> 16fps)
 * @returns {Promise<Object>} - Response containing video URLs
 */
export const generateVideoWithCogVideoX = async (prompt, options = {}) => {
  try {
    console.log("Generating video with CogVideoX, prompt:", prompt);

    const {
      imageInput,
      videoInput,
      videoStrength = 0.8,
      seedValue = -1,
      scaleStatus = false,
      rifeStatus = false
    } = options;

    // Validate inputs
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    if (USE_PROXY) {
      // Use the backend proxy to make the request
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (imageInput) formData.append('imageInput', imageInput);
      if (videoInput) formData.append('videoInput', videoInput);
      
      formData.append('options', JSON.stringify({
        videoStrength,
        seedValue,
        scaleStatus,
        rifeStatus
      }));

      // Aggiungi log per verificare i dati inviati
      console.log("Sending data to proxy:", {
        prompt,
        hasImageInput: !!imageInput,
        hasVideoInput: !!videoInput,
        options: {
          videoStrength,
          seedValue,
          scaleStatus,
          rifeStatus
        }
      });

      const response = await axios.post(
        `${PROXY_BASE_URL}/api/cogvideox/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          // Aggiungi timeout più lungo per dare tempo alla generazione
          timeout: 300000, // 5 minuti
        }
      );

      console.log("Response from CogVideoX API:", response.data);

      if (response.data.success) {
        // Assicurati che la struttura della risposta sia compatibile
        // con ciò che il componente frontend si aspetta
        return {
          output_url: response.data.data[0],
          download_video_url: response.data.data[1],
          download_gif_url: response.data.data[2],
          seed_used: response.data.data[3],
          model: response.data.model || "CogVideoX-5B-Space"
        };
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } else {
      // Questa implementazione non funzionerà direttamente nel browser a causa di CORS
      // e limitazioni con i moduli Node.js nel browser
      throw new Error("Direct API call implementation not supported. Please use proxy mode.");
    }
  } catch (error) {
    console.error("Error during video generation with CogVideoX:", error);
    throw error;
  }
};

/**
 * Enhance a prompt using CogVideoX's enhancer function
 * @param {string} prompt - Original prompt to enhance
 * @returns {Promise<string>} - Enhanced prompt
 */
export const enhancePromptWithCogVideoX = async (prompt) => {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    if (USE_PROXY) {
      // Use the backend proxy
      const response = await axios.post(
        `${PROXY_BASE_URL}/api/cogvideox/enhance-prompt`,
        { prompt },
        { timeout: 30000 } // 30 secondi di timeout
      );

      console.log("Response from enhance prompt API:", response.data);

      if (response.data.success) {
        return response.data.enhancedPrompt;
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } else {
      // Direct call implementation not supported in browser
      throw new Error("Direct API call implementation not supported. Please use proxy mode.");
    }
  } catch (error) {
    console.error("Error enhancing prompt with CogVideoX:", error);
    throw error;
  }
};

/**
 * Resize a video to make it compatible with CogVideoX
 * @param {Blob|File} videoInput - Input video to resize
 * @returns {Promise<Blob>} - Resized video
 */
export const resizeVideoForCogVideoX = async (videoInput) => {
  try {
    if (!videoInput) {
      throw new Error("Video input is required");
    }

    if (USE_PROXY) {
      // Use the backend proxy
      const formData = new FormData();
      formData.append('videoInput', videoInput);

      const response = await axios.post(
        `${PROXY_BASE_URL}/api/cogvideox/resize-video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000 // 2 minuti di timeout
        }
      );

      console.log("Response from resize video API:", response.data);

      if (response.data.success) {
        // La risposta dipenderà da come hai implementato l'endpoint nel backend
        return response.data.resizedVideo;
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } else {
      // Direct call implementation not supported in browser
      throw new Error("Direct API call implementation not supported. Please use proxy mode.");
    }
  } catch (error) {
    console.error("Error resizing video for CogVideoX:", error);
    throw error;
  }
};