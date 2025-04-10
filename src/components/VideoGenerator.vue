<template> 
  <div class="video-generator">
    <h2>Generatore di Video con AI</h2>
    
    <div class="generator-form">
      <div class="input-group">
        <label for="prompt">Descrivi il video che vuoi generare:</label>
        <textarea 
          id="prompt" 
          v-model="prompt" 
          placeholder="Es. Un panda che gioca con una palla nell'acqua, cinematico, 4K"
          rows="3"
        ></textarea>
      </div>
      
      <div class="options">
        <div class="input-group">
          <label>Stile:</label>
          <div class="style-options">
            <button 
              v-for="style in videoStyles" 
              :key="style.name"
              @click="selectStyle(style)"
              :class="{ active: selectedStyle === style.name }"
              type="button"
            >
              {{ style.name }}
            </button>
          </div>
        </div>
      </div>
      
      <button 
        @click="generateNewVideo" 
        :disabled="loading || !prompt.trim()"
        class="generate-btn"
      >
        <span v-if="loading" class="loader"></span>
        <span>{{ loading ? 'Generazione in corso...' : 'Genera Video' }}</span>
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="generatedVideo" class="result-container">
      <h3>Video Generato</h3>
      
      <div v-if="generatedVideo.result && generatedVideo.result.output_url" class="video-result">
        <video 
          controls
          autoplay
          loop
          :src="generatedVideo.result.output_url"
        ></video>
      </div>
      
      <div v-else-if="generatedVideo.status === 'processing'" class="processing">
        <div class="loader large"></div>
        <p>Il video è in fase di elaborazione. Questo processo può richiedere alcuni minuti.</p>
        <p class="processing-time">Tempo stimato: {{ estimatedTime }} secondi</p>
      </div>
      
      <div class="video-info">
        <p><strong>Prompt:</strong> {{ generatedVideo.prompt }}</p>
        <p v-if="generatedVideo.result"><strong>Modello:</strong> {{ generatedVideo.result.model }}</p>
        <p><strong>Creato:</strong> {{ formatDate(generatedVideo.createdAt) }}</p>
      </div>
      
      <div v-if="generatedVideo.result && generatedVideo.result.output_url" class="actions">
        <button @click="downloadVideo" class="action-btn">
          <span class="icon">↓</span> Scarica
        </button>
      </div>
    </div>
    
    <div v-if="generatedVideos.length > 0" class="gallery">
      <h3>I tuoi video generati</h3>
      <div class="videos-grid">
        <div 
          v-for="video in generatedVideos" 
          :key="video.id" 
          class="gallery-item"
          @click="selectVideo(video)"
        >
          <video 
            :src="video.result && video.result.output_url" 
            muted 
          ></video>
          <div class="gallery-item-info">
            <p class="gallery-item-prompt">{{ truncateText(video.prompt, 60) }}</p>
            <p class="gallery-item-date">{{ formatDate(video.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateVideo } from '../services/videoService';

// Stato
const prompt = ref('');
const selectedStyle = ref('Cinematico');
const loading = ref(false);
const error = ref('');
const generatedVideo = ref(null);
const generatedVideos = ref([]);
const estimatedTime = ref(30);

// Stili predefiniti per i video
const videoStyles = [
  { name: 'Cinematico', prompt: 'cinematico, filmato professionale, 4K, qualità da studio' },
  { name: 'Anime', prompt: 'stile anime, colorato, artistico, come uno studio Ghibli' },
  { name: '3D', prompt: 'rendering 3D, stile Pixar, dettagliato, illuminazione volumetrica' },
  { name: 'Realistico', prompt: 'fotorealistico, dettagliato, illuminazione naturale' },
  { name: 'Vintage', prompt: 'filmato vintage, colori sbiaditi, grana pellicola, stile anni \'70' }
];

// Funzione per formattare la data
const formatDate = (date) => {
  return new Date(date).toLocaleString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funzione per troncare il testo
const truncateText = (text, maxLength) => {
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
};

// Carica i video salvati all'avvio
onMounted(() => {
  const savedVideos = localStorage.getItem('generatedVideos');
  if (savedVideos) {
    try {
      generatedVideos.value = JSON.parse(savedVideos);
      if (generatedVideos.value.length > 0) {
        generatedVideo.value = generatedVideos.value[0];
      }
    } catch (e) {
      console.error("Errore nel parsing dei video salvati:", e);
    }
  }
  
  // Aggiunge event listeners per il play/pause al passaggio del mouse sulle miniature della gallery
  setTimeout(setupVideoHovers, 500);
});

// Setup per hover sulle miniature video (con gestione degli errori di play)
const setupVideoHovers = () => {
  const videoElements = document.querySelectorAll('.gallery-item video');
  if (videoElements.length === 0) return;
  videoElements.forEach(video => {
    const parent = video.parentElement;
    let playPromise = null;
    parent.addEventListener('mouseenter', () => {
      if (!playPromise) {
        playPromise = video.play()
          .then(() => { playPromise = null; })
          .catch(e => {
            if (e.name !== 'AbortError') console.error('Errore play video:', e);
            playPromise = null;
          });
      }
    });
    parent.addEventListener('mouseleave', () => {
      if (playPromise) {
        playPromise.then(() => { video.pause(); video.currentTime = 0; })
          .catch(() => { video.pause(); video.currentTime = 0; });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  });
};

// Seleziona uno stile predefinito senza modificare automaticamente il prompt
const selectStyle = (style) => {
  selectedStyle.value = style.name;
};

// Calcola il prompt finale integrando il prompt utente e lo stile selezionato
const getEnhancedPrompt = () => {
  const style = videoStyles.find(s => s.name === selectedStyle.value);
  return style && prompt.value ? `${prompt.value}, ${style.prompt}` : prompt.value;
};

// Genera un nuovo video
const generateNewVideo = async () => {
  if (!prompt.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  // Prepara i dati del nuovo video
  const newVideo = {
    id: Date.now().toString(),
    prompt: prompt.value,
    enhancedPrompt: getEnhancedPrompt(),
    style: selectedStyle.value,
    status: 'processing',
    createdAt: new Date()
  };
  
  // Visualizza subito lo stato "in elaborazione"
  generatedVideo.value = newVideo;
  
  try {
    // Chiamata al servizio unificato
    const result = await generateVideo(getEnhancedPrompt());
    
    // Aggiorna il video con il risultato ottenuto
    newVideo.result = result;
    newVideo.status = 'completed';
    
    generatedVideo.value = newVideo;
    generatedVideos.value.unshift(newVideo);
    localStorage.setItem('generatedVideos', JSON.stringify(generatedVideos.value));
    
    // Aggiorna gli event listeners per gli hover dei video
    setTimeout(setupVideoHovers, 500);
    
  } catch (err) {
    error.value = 'Si è verificato un errore durante la generazione del video. Riprova più tardi.';
    console.error("Errore dettagliato:", err);
  } finally {
    loading.value = false;
  }
};

// Funzione per scaricare il video generato
const downloadVideo = () => {
  if (!generatedVideo.value || !generatedVideo.value.result || !generatedVideo.value.result.output_url) return;
  
  const link = document.createElement('a');
  link.href = generatedVideo.value.result.output_url;
  link.download = `ai-video-${Date.now()}.mp4`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Funzione per selezionare un video dalla galleria
const selectVideo = (video) => {
  generatedVideo.value = video;
};
</script>

<style scoped>
.video-generator {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.generator-form {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
}

.input-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
}

.options {
  background-color: var(--gray-100);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.style-options button {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.style-options button.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.generate-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.generate-btn:disabled {
  background-color: var(--gray-400);
  cursor: not-allowed;
}

.error-message {
  color: var(--danger);
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff5f5;
  border-left: 4px solid var(--danger);
  border-radius: var(--border-radius);
}

.result-container {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  background-color: white;
}

.video-result {
  margin: 1rem 0;
  text-align: center;
}

.video-result video {
  max-width: 100%;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
}

.processing-time {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.video-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--secondary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: var(--primary-dark);
}

.gallery {
  margin-top: 3rem;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.gallery-item {
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: var(--shadow-sm);
  background-color: var(--gray-100);
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.gallery-item video {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.gallery-item-info {
  padding: 0.75rem;
}

.gallery-item-prompt {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.gallery-item-date {
  font-size: 0.8rem;
  color: var(--gray-600);
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.loader.large {
  width: 40px;
  height: 40px;
  border-width: 4px;
  border-top-color: var(--primary);
  border-left-color: rgba(67, 97, 238, 0.3);
  border-right-color: rgba(67, 97, 238, 0.3);
  border-bottom-color: rgba(67, 97, 238, 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>