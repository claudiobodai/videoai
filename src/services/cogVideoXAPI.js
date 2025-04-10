// src/services/cogVideoXAPI.js
import { Client } from "@gradio/client";
import axios from "axios";

// Flag per decidere se usare la versione diretta o il proxy server
const USE_PROXY = true;
const PROXY_BASE_URL = "https://videoai-backend.onrender.com"; // Cambia in base al tuo backend

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

      const response = await axios.post(
        `${PROXY_BASE_URL}/api/cogvideox/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
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
      // Direct API call using Gradio client
      // Connect to the CogVideoX Space
      const client = await Client.connect("THUDM/CogVideoX-5B-Space");

      // Generate the video
      const result = await client.predict("/generate", {
        prompt,
        image_input: imageInput,
        video_input: videoInput,
        video_strength: videoStrength,
        seed_value: seedValue,
        scale_status: scaleStatus,
        rife_status: rifeStatus
      });

      // Process the result
      // result.data is an array with 4 elements:
      // [0]: Video component output
      // [1]: Download Video file
      // [2]: Download GIF file
      // [3]: Seed used for generation
      return {
        output_url: result.data[0], // Video URL
        download_video_url: result.data[1], // Download video URL
        download_gif_url: result.data[2], // Download GIF URL
        seed_used: result.data[3], // Seed used for generation
        model: "CogVideoX-5B-Space"
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
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    if (USE_PROXY) {
      // Use the backend proxy
      const response = await axios.post(
        `${PROXY_BASE_URL}/api/cogvideox/enhance-prompt`,
        { prompt }
      );

      if (response.data.success) {
        return response.data.enhancedPrompt;
      } else {
        throw new Error(response.data.error || "Unknown error");
      }
    } else {
      // Direct call using Gradio client
      const client = await Client.connect("THUDM/CogVideoX-5B-Space");
      const result = await client.predict("/enhance_prompt_func", {
        prompt: prompt
      });

      return result.data;
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

    // For this operation, we'll always use the direct API as it's more efficient
    // for file processing and doesn't require our backend to handle large files
    const client = await Client.connect("THUDM/CogVideoX-5B-Space");
    const result = await client.predict("/resize_if_unfit", {
      input_video: videoInput
    });

    return result.data;
  } catch (error) {
    console.error("Error resizing video for CogVideoX:", error);
    throw error;
  }
};