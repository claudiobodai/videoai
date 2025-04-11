// src/utils/videoMock.js
// Create this file for fallback video generation

/**
 * Utility function to generate mock videos for demo purposes
 * This is used when real API calls fail
 * @param {string} promptText - The prompt text used for the video
 * @returns {Promise<Object>} A mock video result
 */
export const generateVideoMock = async (promptText) => {
    console.log("Using mock video generator with prompt:", promptText);
    
    // Simula un ritardo di elaborazione
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Array di video di esempio
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    ];
    
    // Scegli un video in base al contenuto del prompt (pseudo-deterministic)
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    const promptHash = hashCode(promptText);
    const videoIndex = promptHash % sampleVideos.length;
    const selectedVideo = sampleVideos[videoIndex];
    
    // Per il GIF, scegliamo una delle opzioni disponibili
    const sampleGifs = [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHRwcG5ycnd6MzNsc2lyOHpuNHp6cHAycDIzbXpjYjEzczI0Z3NieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S6VGjvmFRu5Qk/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzNmem9zdHBvaHdhNnR1aXY5Mjc1cDlwZml6aGVwcDRuaWVzeTUyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YsTs5ltWtEhnq/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemM1b3o0M3Y3bTVsbDdnem9yaWFld2ZmcG8ybmVhMXV5ZXgwc3BueiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7ZetIsjtbkgNE1I4/giphy.gif"
    ];
    const gifIndex = (promptHash + 1) % sampleGifs.length;
    
    return {
      output_url: selectedVideo,
      download_video_url: selectedVideo,
      download_gif_url: sampleGifs[gifIndex],
      model: "video-simulation-mock",
      status: "completed",
      seed_used: promptHash % 1000,
      fallback: true
    };
  };