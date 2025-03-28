import { defineStore } from 'pinia';
import { generateImage, enhanceImage } from '../services/deepai';

export const useImagesStore = defineStore('images', {
  state: () => ({
    searchResults: [],
    generatedImages: [],
    isLoading: false,
    error: null,
    searchQuery: '',
  }),
  
  getters: {
    getSearchResults: (state) => state.searchResults,
    getGeneratedImages: (state) => state.generatedImages,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  
  actions: {
    // Ricerca immagini da Unsplash
    async searchImages(query) {
      if (!query.trim()) return;
      
      this.isLoading = true;
      this.error = null;
      this.searchQuery = query;
      
      try {
        const results = await fetchImages(query);
        this.searchResults = results;
      } catch (error) {
        this.error = 'Errore durante la ricerca delle immagini.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Genera immagini con DeepAI
    async generateImageWithAI(prompt) {
      if (!prompt.trim()) return;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const result = await generateImage(prompt);
        
        // Aggiungi metadati alla risposta
        const generatedImage = {
          id: Date.now().toString(),
          prompt,
          result,
          createdAt: new Date()
        };
        
        this.generatedImages.unshift(generatedImage);
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
        const result = await enhanceImage(imageUrl);
        
        // Aggiorna l'immagine nel store
        const index = this.generatedImages.findIndex(img => img.id === imageId);
        if (index !== -1) {
          this.generatedImages[index].result = result;
          this.generatedImages[index].enhancedAt = new Date();
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