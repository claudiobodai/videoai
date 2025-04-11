// src/services/cogVideoXAPI.js
import axios from "axios";

// Use relative URL when in development (works with Vite proxy)
// or absolute URL in production
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_BASE_URL || "https://videoai-backend.onrender.com")
  : ""; // Empty string means use the current origin (which will go through the Vite proxy)

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 300000, // 5 minute timeout (video generation can take time)
});

// Add request interceptor for logging
apiClient.interceptors.request.use(config => {
  console.log(`Sending ${config.method.toUpperCase()} request to: ${config.url}`);
  return config;
});

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

    // Validate inputs
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string");
    }

    const {
      imageInput,
      videoInput,
      videoStrength = 0.8,
      seedValue = -1,
      scaleStatus = false,
      rifeStatus = false
    } = options;

    // Create form data to send files
    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Add files only if they exist
    if (imageInput) formData.append('imageInput', imageInput);
    if (videoInput) formData.append('videoInput', videoInput);
    
    // Add other options as JSON
    formData.append('options', JSON.stringify({
      videoStrength: parseFloat(videoStrength),
      seedValue: parseInt(seedValue),
      scaleStatus: Boolean(scaleStatus),
      rifeStatus: Boolean(rifeStatus)
    }));

    // Full URL to the endpoint
    const apiUrl = `${API_BASE_URL}/api/cogvideox/generate`;

    try {
      console.log("Sending video generation request to:", apiUrl);
      const response = await apiClient.post(
        apiUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Response from CogVideoX API:", response.data);

      if (response.data.success) {
        // Format the response to match what the frontend expects
        return {
          output_url: response.data.data[0],
          download_video_url: response.data.data[1],
          download_gif_url: response.data.data[2],
          seed_used: response.data.data[3],
          model: response.data.model || "CogVideoX-5B-Space",
          fallback: response.data.fallback || false
        };
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      
      if (apiError.response) {
        console.error("API response status:", apiError.response.status);
        console.error("API response data:", apiError.response.data);
      }
      
      // Check if this is a CORS or network error
      const isCorsError = apiError.message && (
        apiError.message.includes('CORS') || 
        apiError.message.includes('Network Error')
      );
      
      if (isCorsError) {
        console.warn("CORS or network issue detected. Using fallback video.");
      }
      
      // Use a fallback for development/testing
      console.log("Using fallback video response");
      
      const videoUrls = [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      ];
      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      
      return {
        output_url: randomVideoUrl,
        download_video_url: randomVideoUrl,
        download_gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHRwcG5ycnd6MzNsc2lyOHpuNHp6cHAycDIzbXpjYjEzczI0Z3NieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S6VGjvmFRu5Qk/giphy.gif",
        seed_used: parseInt(options.seedValue) || Math.floor(Math.random() * 1000),
        model: "CogVideoX-5B-Space (Fallback)",
        fallback: true
      };
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
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string");
    }

    // Full URL to the endpoint
    const apiUrl = `${API_BASE_URL}/api/cogvideox/enhance-prompt`;
    
    console.log("Sending prompt enhancement request to:", apiUrl);
    const response = await apiClient.post(
      apiUrl,
      { prompt },
      { 
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    console.log("Response from enhance prompt API:", response.data);

    if (response.data.success) {
      // Handle both string and array responses
      if (Array.isArray(response.data.enhancedPrompt)) {
        return response.data.enhancedPrompt[0]; // Return the first item if it's an array
      }
      return response.data.enhancedPrompt; // Return as is if it's a string
    } else {
      throw new Error(response.data.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error enhancing prompt with CogVideoX:", error);
    
    // If this is a CORS or network error, provide a fallback enhanced prompt
    if (error.message && (error.message.includes('CORS') || error.message.includes('Network Error'))) {
      console.warn("CORS or network issue detected for prompt enhancement. Using fallback.");
      return `${prompt}, cinematografico, dettagliato, illuminazione professionale, alta qualità, movimento fluido`;
    }
    
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

    const formData = new FormData();
    formData.append('videoInput', videoInput);

    // Full URL to the endpoint
    const apiUrl = `${API_BASE_URL}/api/cogvideox/resize-video`;

    console.log("Sending video resize request to:", apiUrl);
    const response = await apiClient.post(
      apiUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log("Response from resize video API:", response.data);

    if (response.data.success) {
      return response.data.resizedVideo;
    } else {
      throw new Error(response.data.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error resizing video for CogVideoX:", error);
    throw error;
  }
};