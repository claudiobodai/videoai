// src/services/cogVideoXAPI.js
import axios from "axios";

// URL del backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://videoai-backend.onrender.com";

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

    // Create form data to send files
    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Add files only if they exist
    if (imageInput) formData.append('imageInput', imageInput);
    if (videoInput) formData.append('videoInput', videoInput);
    
    // Add other options as JSON
    formData.append('options', JSON.stringify({
      videoStrength,
      seedValue,
      scaleStatus,
      rifeStatus
    }));

    // Remove any duplicate slashes in URL
    const apiUrl = `${API_BASE_URL}/api/cogvideox/generate`.replace(/([^:]\/)\/+/g, "$1");

    const response = await axios.post(
      apiUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add longer timeout for video generation
        timeout: 300000, // 5 minutes
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

    // Remove any duplicate slashes in URL
    const apiUrl = `${API_BASE_URL}/api/cogvideox/enhance-prompt`.replace(/([^:]\/)\/+/g, "$1");
    
    const response = await axios.post(
      apiUrl,
      { prompt },
      { timeout: 30000 } // 30 secondi di timeout
    );

    console.log("Response from enhance prompt API:", response.data);

    if (response.data.success) {
      return response.data.enhancedPrompt;
    } else {
      throw new Error(response.data.error || "Unknown error");
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

    const formData = new FormData();
    formData.append('videoInput', videoInput);

    // Remove any duplicate slashes in URL
    const apiUrl = `${API_BASE_URL}/api/cogvideox/resize-video`.replace(/([^:]\/)\/+/g, "$1");

    const response = await axios.post(
      apiUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000 // 2 minutes timeout
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