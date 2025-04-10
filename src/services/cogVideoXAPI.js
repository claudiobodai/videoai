// src/services/cogVideoXAPI.js
import { Client } from "@gradio/client";

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
    if (!prompt || (!imageInput && !videoInput)) {
      throw new Error("Prompt and at least one input (image or video) are required");
    }

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
    const processedResult = {
      output_url: result.data[0], // Video URL
      download_video_url: result.data[1], // Download video URL
      download_gif_url: result.data[2], // Download GIF URL
      seed_used: result.data[3], // Seed used for generation
      model: "CogVideoX-5B-Space"
    };

    return processedResult;
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

    const client = await Client.connect("THUDM/CogVideoX-5B-Space");
    const result = await client.predict("/enhance_prompt_func", {
      prompt: prompt
    });

    return result.data;
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