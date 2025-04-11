// The auth.js store can remain as is, but both images.js and videos.js have unused references
// and should be removed or simplified.

// Keep auth.js as it is for authentication logic

// For images.js and videos.js, they reference non-existent functions like:
// - generateImage and enhanceImage from '../services/deepai' 
// - generateVideo from '../services/deepai'

// Since these stores aren't actually used in the components (components use direct API calls),
// we should remove them or update them to use the correct services.

// Here's a cleaned up version of images.js if you decide to keep it:

// src/stores/images.js
import { defineStore } from 'pinia';
import { generateImage, enhanceImageResolution } from '../services/imageService';

export const useImagesStore = defineStore('images', {
  state: () => ({
    generatedImages: [],
    isLoading: false,
    error: null,
  }),
  
  getters: {
    getGeneratedImages: (state) => state.generatedImages,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  
  actions: {
    // Genera immagini con API
    async generateImageWithAI(prompt, options = {}) {
      if (!prompt.trim()) return;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const result = await generateImage(prompt, options);
        
        // Aggiungi metadati alla risposta
        const generatedImage = {
          id: Date.now().toString(),
          prompt,
          options,
          result,
          createdAt: new Date()
        };
        
        this.generatedImages.unshift(generatedImage);
        this.saveGeneratedImages();
        return generatedImage;
      } catch (error) {
        this.error = 'Errore durante la generazione dell\'immagine.';
        console.error(error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Migliora la risoluzione di un'immagine
    async enhanceImageWithAI(imageId, imageUrl) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const result = await enhanceImageResolution(imageUrl);
        
        // Aggiorna l'immagine nel store
        const index = this.generatedImages.findIndex(img => img.id === imageId);
        if (index !== -1) {
          this.generatedImages[index].result = result;
          this.generatedImages[index].enhancedAt = new Date();
          this.saveGeneratedImages();
        }
        
        return result;
      } catch (error) {
        this.error = 'Errore durante il miglioramento dell\'immagine.';
        console.error(error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Elimina un'immagine generata
    deleteGeneratedImage(imageId) {
      this.generatedImages = this.generatedImages.filter(img => img.id !== imageId);
      this.saveGeneratedImages();
    },
    
    // Salva le immagini generate nel localStorage
    saveGeneratedImages() {
      localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages));
    },
    
    // Carica le immagini generate dal localStorage
    loadGeneratedImages() {
      const savedImages = localStorage.getItem('generatedImages');
      if (savedImages) {
        this.generatedImages = JSON.parse(savedImages);
      }
    }
  }
});

// And a simplified videos.js store:

// src/stores/videos.js
import { defineStore } from 'pinia';
import { generateVideoWithCogVideoX } from '../services/cogVideoXAPI';

export const useVideosStore = defineStore('videos', {
  state: () => ({
    generatedVideos: [],
    isLoading: false,
    error: null,
  }),
  
  getters: {
    getGeneratedVideos: (state) => state.generatedVideos,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  
  actions: {
    // Genera video con CogVideoX API
    async generateVideoWithAI(prompt, options = {}) {
      if (!prompt.trim()) return;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        // Create a video entry immediately with processing status
        const videoRequest = {
          id: Date.now().toString(),
          prompt,
          options,
          status: 'processing',
          createdAt: new Date()
        };
        
        this.generatedVideos.unshift(videoRequest);
        this.saveVideos();
        
        // Generate the video
        const result = await generateVideoWithCogVideoX(prompt, options);
        
        // Update the entry with results
        const index = this.generatedVideos.findIndex(v => v.id === videoRequest.id);
        if (index !== -1) {
          this.generatedVideos[index] = {
            ...this.generatedVideos[index],
            result,
            status: 'completed',
            completedAt: new Date()
          };
          this.saveVideos();
        }
        
        return this.generatedVideos[index];
      } catch (error) {
        this.error = 'Errore durante la generazione del video.';
        console.error(error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Elimina un video generato
    deleteVideo(videoId) {
      this.generatedVideos = this.generatedVideos.filter(video => video.id !== videoId);
      this.saveVideos();
    },
    
    // Salva i video nel localStorage
    saveVideos() {
      localStorage.setItem('generatedVideos', JSON.stringify(this.generatedVideos));
    },
    
    // Carica i video dal localStorage
    loadVideos() {
      const savedVideos = localStorage.getItem('generatedVideos');
      if (savedVideos) {
        this.generatedVideos = JSON.parse(savedVideos);
      }
    }
  }
});