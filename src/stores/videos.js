import { defineStore } from 'pinia';
import { generateVideo } from '../services/deepai';

export const useVideosStore = defineStore('videos', {
  state: () => ({
    generatedVideos: [],
    pendingVideos: [],
    isLoading: false,
    error: null,
  }),
  
  getters: {
    getGeneratedVideos: (state) => state.generatedVideos,
    getPendingVideos: (state) => state.pendingVideos,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
  },
  
  actions: {
    // Genera video con DeepAI (o altra API)
    async generateVideoWithAI(prompt, duration = 5) {
      if (!prompt.trim()) return;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const result = await generateVideo(prompt);
        
        // Aggiungi metadati alla risposta
        const videoRequest = {
          id: Date.now().toString(),
          prompt,
          duration,
          status: result.status,
          jobId: result.id,
          createdAt: new Date()
        };
        
        // Aggiungi ai video in attesa
        this.pendingVideos.unshift(videoRequest);
        
        // In un'applicazione reale, inizieresti un polling per controllare lo stato
        // Qui simuliamo che il video sarà pronto dopo un po'
        setTimeout(() => {
          this.updateVideoStatus(videoRequest.id, 'completed', 'https://example.com/fake-video.mp4');
        }, 5000);
        
        return videoRequest;
      } catch (error) {
        this.error = 'Errore durante la generazione del video.';
        console.error(error);
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Aggiorna lo stato di un video
    updateVideoStatus(id, status, outputUrl = null) {
      const pendingIndex = this.pendingVideos.findIndex(video => video.id === id);
      
      if (pendingIndex !== -1) {
        const video = this.pendingVideos[pendingIndex];
        
        // Se completato, spostalo nei video generati
        if (status === 'completed' && outputUrl) {
          const completedVideo = {
            ...video,
            status,
            outputUrl,
            completedAt: new Date()
          };
          
          this.generatedVideos.unshift(completedVideo);
          this.pendingVideos.splice(pendingIndex, 1);
          
          // Salva nel localStorage
          this.saveVideos();
        } else {
          // Altrimenti aggiorna solo lo stato
          this.pendingVideos[pendingIndex].status = status;
        }
      }
    },
    
    // Elimina un video generato
    deleteVideo(videoId) {
      this.generatedVideos = this.generatedVideos.filter(video => video.id !== videoId);
      this.saveVideos();
    },
    
    // Controlla lo stato dei video in attesa (simula il polling)
    checkPendingVideos() {
      // In un'applicazione reale, faresti una chiamata API per ciascun video in attesa
      // per controllarne lo stato
      console.log('Controllo video in attesa:', this.pendingVideos.length);
    },
    
    // Salva i video nel localStorage
    saveVideos() {
      localStorage.setItem('generatedVideos', JSON.stringify(this.generatedVideos));
      localStorage.setItem('pendingVideos', JSON.stringify(this.pendingVideos));
    },
    
    // Carica i video dal localStorage
    loadVideos() {
      const savedVideos = localStorage.getItem('generatedVideos');
      const pendingVideos = localStorage.getItem('pendingVideos');
      
      if (savedVideos) {
        this.generatedVideos = JSON.parse(savedVideos);
      }
      
      if (pendingVideos) {
        this.pendingVideos = JSON.parse(pendingVideos);
      }
    }
  }
});