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
        <button 
          v-if="selectedEngine === 'cogvideox'"
          @click="enhancePrompt" 
          class="enhance-btn"
          :disabled="!prompt.trim() || enhancing"
        >
          {{ enhancing ? 'Miglioramento...' : 'Migliora prompt' }}
        </button>
      </div>
      
      <div class="options">
        <div class="input-row">
          <div class="input-group">
            <label for="numFrames">Numero di frame:</label>
            <input 
              type="range" 
              id="numFrames" 
              v-model="numFrames" 
              min="16" 
              max="48" 
              step="8"
              :disabled="selectedEngine === 'cogvideox'"
            />
            <span>{{ numFrames }}</span>
          </div>
          
          <div class="input-group">
            <label for="inferenceSteps">Qualità (10-50):</label>
            <input 
              type="range" 
              id="inferenceSteps" 
              v-model="inferenceSteps" 
              min="10" 
              max="50" 
              step="5"
              :disabled="selectedEngine === 'cogvideox'"
            />
            <span>{{ inferenceSteps }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <label>Motore di generazione:</label>
          <div class="style-options">
            <button 
              v-for="engine in engines" 
              :key="engine.value"
              @click="selectedEngine = engine.value"
              :class="{ active: selectedEngine === engine.value }"
              type="button"
            >
              {{ engine.name }}
            </button>
          </div>
        </div>
        
        <!-- Opzioni specifiche per CogVideoX -->
        <div v-if="selectedEngine === 'cogvideox'" class="cogvideo-options">
          <div class="input-group">
            <label>Forza dell'immagine/video iniziale:</label>
            <input 
              type="range" 
              v-model="videoStrength" 
              min="0.1" 
              max="1.0" 
              step="0.1"
            />
            <span>{{ videoStrength }}</span>
          </div>
          
          <div class="input-group">
            <label for="seedValue">Seed per generazione (-1 per casuale):</label>
            <input 
              type="number" 
              id="seedValue" 
              v-model="seedValue"
              min="-1"
            />
          </div>
          
          <div class="input-row">
            <div class="input-group checkbox-group">
              <input 
                type="checkbox" 
                id="scaleStatus" 
                v-model="scaleStatus"
              />
              <label for="scaleStatus">Super-Resolution (720 × 480 -> 2880 × 1920)</label>
            </div>
            
            <div class="input-group checkbox-group">
              <input 
                type="checkbox" 
                id="rifeStatus" 
                v-model="rifeStatus"
              />
              <label for="rifeStatus">Frame Interpolation (8fps -> 16fps)</label>
            </div>
          </div>
          
          <div class="input-group">
            <label>Immagine iniziale (opzionale):</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageUpload"
            />
          </div>
          
          <div class="input-group">
            <label>Video iniziale (opzionale):</label>
            <input 
              type="file" 
              accept="video/*" 
              @change="handleVideoUpload"
            />
          </div>
        </div>
        
        <!-- Stili solo per motori non-CogVideoX -->
        <div v-else class="input-group">
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
        :disabled="loading || !prompt.trim() || (selectedEngine === 'cogvideox' && !hasValidInputs)"
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
        <button 
          v-if="generatedVideo.result.download_gif_url" 
          @click="downloadFile(generatedVideo.result.download_gif_url, 'video-ai.gif')" 
          class="action-btn"
        >
          Scarica GIF
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
import { ref, computed, onMounted } from 'vue';
import { generateVideoWithCogVideoX, enhancePromptWithCogVideoX } from '../services/cogVideoXAPI';
import { Client } from "@gradio/client";

// Stato
const prompt = ref('');
const numFrames = ref(24);
const inferenceSteps = ref(25);
const selectedStyle = ref('Cinematico');
const loading = ref(false);
const enhancing = ref(false);
const error = ref('');
const generatedVideo = ref(null);
const generatedVideos = ref([]);
const estimatedTime = ref(60);

// Opzioni specifiche per CogVideoX
const videoStrength = ref(0.8);
const seedValue = ref(-1);
const scaleStatus = ref(false);
const rifeStatus = ref(false);
const imageInput = ref(null);
const videoInput = ref(null);

// Controllo se l'URL dell'API Wan2.1 è stato precedentemente salvato
const wan21ApiUrlSet = ref(!!sessionStorage.getItem('wan21ApiUrl'));

// Se salvato in sessione, imposta l'URL dell'API Wan2.1
if (wan21ApiUrlSet.value) {
  setWan21ApiUrl(sessionStorage.getItem('wan21ApiUrl'));
}

// Computed property per verificare se ci sono input validi per CogVideoX
const hasValidInputs = computed(() => {
  if (selectedEngine.value !== 'cogvideox') return true;
  return prompt.value.trim();
});

// Opzioni per i motori di generazione
const engines = [
  { name: 'Stable Diffusion', value: 'stablediffusion' },
  { name: 'Open-Sora', value: 'opensora' },
  { name: 'Wan2.1', value: 'wan21' },
  { name: 'CogVideoX', value: 'cogvideox' }
];
const selectedEngine = ref('stablediffusion');

// Stili predefiniti per i video
const videoStyles = [
  { name: 'Cinematico', prompt: 'cinematico, filmato professionale, 4K, qualità da studio' },
  { name: 'Anime', prompt: 'stile anime, colorato, artistico, come uno studio Ghibli' },
  { name: '3D', prompt: 'rendering 3D, stile Pixar, dettagliato, illuminazione volumetrica' },
  { name: 'Realistico', prompt: 'fotorealistico, dettagliato, illuminazione naturale' },
  { name: 'Vintage', prompt: 'filmato vintage, colori sbiaditi, grana pellicola, stile anni \'70' }
];

// Gestione caricamento file
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageInput.value = file;
  }
};

const handleVideoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    videoInput.value = file;
  }
};

// Funzione per migliorare il prompt con CogVideoX
const enhancePrompt = async () => {
  if (!prompt.value.trim()) return;
  
  enhancing.value = true;
  error.value = '';
  
  try {
    const enhancedPrompt = await enhancePromptWithCogVideoX(prompt.value);
    prompt.value = enhancedPrompt;
  } catch (err) {
    error.value = "Errore durante il miglioramento del prompt: " + err.message;
  } finally {
    enhancing.value = false;
  }
};

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

// Setup per hover sulle miniature video
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

// Seleziona uno stile predefinito
const selectStyle = (style) => {
  selectedStyle.value = style.name;
};

// Calcola il prompt finale integrando il prompt utente e lo stile selezionato
const getEnhancedPrompt = () => {
  if (selectedEngine.value === 'cogvideox') {
    return prompt.value;
  }
  
  const style = videoStyles.find(s => s.name === selectedStyle.value);
  return style && prompt.value ? `${prompt.value}, ${style.prompt}` : prompt.value;
};

// Genera un nuovo video in base al motore selezionato
const generateNewVideo = async () => {
  if (!prompt.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  // Calcola il tempo stimato in base al motore
  estimatedTime.value = selectedEngine.value === 'opensora'
                        ? 180 
                        : selectedEngine.value === 'wan21'
                          ? 90 
                          : selectedEngine.value === 'cogvideox'
                            ? 120
                            : Math.round((inferenceSteps.value * numFrames.value) / 10);
  
  // Prepara i dati del nuovo video
  const newVideo = {
    id: Date.now().toString(),
    prompt: prompt.value,
    enhancedPrompt: getEnhancedPrompt(),
    style: selectedStyle.value,
    engine: selectedEngine.value,
    numFrames: numFrames.value,
    inferenceSteps: inferenceSteps.value,
    status: 'processing',
    createdAt: new Date()
  };
  
  // Visualizza subito lo stato "in elaborazione"
  generatedVideo.value = newVideo;
  
  try {
    let result;
    
    if (selectedEngine.value === 'cogvideox') {
      console.log("Generando video con CogVideoX...");
      
      // Utilizza CogVideoX
      result = await generateVideoWithCogVideoX(prompt.value, {
        imageInput: imageInput.value,
        videoInput: videoInput.value,
        videoStrength: videoStrength.value,
        seedValue: seedValue.value,
        scaleStatus: scaleStatus.value,
        rifeStatus: rifeStatus.value
      });
      
    } else if (selectedEngine.value === 'wan21') {
      console.log("Generando video con Wan2.1...");
      
      // Se l'URL dell'API non è già stato impostato, richiedilo
      if (!wan21ApiUrlSet.value) {
        const apiUrl = window.prompt(
          "Inserisci l'URL dell'API Wan2.1 (es. l'URL ngrok del server Flask su Google Colab):",
          sessionStorage.getItem('wan21ApiUrl') || 'https://bead-35-197-47-34.ngrok-free.app'
        );
        if (apiUrl) {
          setWan21ApiUrl(apiUrl);
          sessionStorage.setItem('wan21ApiUrl', apiUrl);
          wan21ApiUrlSet.value = true;
        } else {
          throw new Error("URL API Wan2.1 non fornito");
        }
      }
      
      // Usa una funzione di placeholder per Wan2.1 (da implementare)
      result = await generateVideoMock(getEnhancedPrompt());
      
    } else if (selectedEngine.value === 'opensora') {
      console.log("Generando video con Open-Sora...");
      // Utilizza il client Gradio per Open-Sora (placeholder)
      try {
        const client = await Client.connect("claudiobxdai/Sora");
        const gradioResponse = await client.predict("/predict", { prompt: getEnhancedPrompt() });
        result = {
          output_url: gradioResponse.data[1] || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          model: "open-sora"
        };
      } catch (err) {
        console.error("Errore con OpenSora API, utilizzo fallback:", err);
        result = await generateVideoMock(getEnhancedPrompt());
      }
      
    } else {
      console.log("Generando video con Stable Diffusion...");
      // Placeholder per generazione video con Stable Diffusion
      result = await generateVideoMock(getEnhancedPrompt());
    }
    
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
    
    // Fallback: in ambiente demo o sviluppo, genera un video simulato
    if (process.env.NODE_ENV === 'development' || true) {
      setTimeout(() => {
        const fakeVideo = {
          id: Date.now().toString(),
          prompt: prompt.value,
          enhancedPrompt: getEnhancedPrompt(),
          style: selectedStyle.value,
          engine: selectedEngine.value,
          status: 'completed',
          result: {
            output_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            model: `${selectedEngine.value} (simulato)`
          },
          createdAt: new Date()
        };
        generatedVideo.value = fakeVideo;
        generatedVideos.value.unshift(fakeVideo);
        localStorage.setItem('generatedVideos', JSON.stringify(generatedVideos.value));
        
        // Aggiorna gli event listeners per gli hover dei video
        setTimeout(setupVideoHovers, 500);
      }, 3000);
    }
  } finally {
    loading.value = false;
  }
};

// Funzione mockup per generazione video (modalità fallback/simulazione)
const generateVideoMock = async (promptText) => {
  // Simula un ritardo di elaborazione
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Array di video di esempio
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ];
  
  // Sceglie un video casuale
  const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
  
  return {
    output_url: randomVideo,
    download_video_url: randomVideo,
    download_gif_url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHRwcG5ycnd6MzNsc2lyOHpuNHp6cHAycDIzbXpjYjEzczI0Z3NieSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S6VGjvmFRu5Qk/giphy.gif",
    model: "video-simulation",
    status: "completed",
    seed_used: Math.floor(Math.random() * 1000)
  };
};

// Funzione per scaricare il video generato
const downloadVideo = () => {
  if (!generatedVideo.value || !generatedVideo.value.result || !generatedVideo.value.result.output_url) return;
  
  // Se disponibile, utilizza l'URL di download dedicato
  const downloadUrl = generatedVideo.value.result.download_video_url || generatedVideo.value.result.output_url;
  downloadFile(downloadUrl, `ai-video-${Date.now()}.mp4`);
};

// Funzione generica per il download di file
const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Funzione per selezionare un video dalla galleria
const selectVideo = (video) => {
  generatedVideo.value = video;
};

// Funzione placeholder per impostare l'URL API di Wan2.1
const setWan21ApiUrl = (url) => {
  console.log(`API Wan2.1 URL impostato: ${url}`);
  // Qui implementeresti la logica per configurare il client Wan2.1
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
  position: relative;
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

.enhance-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: var(--primary-light);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.enhance-btn:hover:not(:disabled) {
  background-color: var(--primary);
}

.enhance-btn:disabled {
  background-color: var(--gray-400);
  cursor: not-allowed;
}

.input-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-row .input-group {
  flex: 1;
}

.input-group input[type="range"] {
  width: 100%;
  margin-right: 0.5rem;
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.checkbox-group label {
  margin-bottom: 0;
}

.cogvideo-options {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(67, 97, 238, 0.05);
  border-radius: var(--border-radius);
  border-left: 3px solid var(--primary);
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

@media (max-width: 768px) {
  .video-generator {
    padding: 1rem;
  }
  
  .input-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .style-options {
    flex-wrap: wrap;
  }
  
  .style-options button {
    flex: 1 0 45%;
    margin-bottom: 0.5rem;
  }
}
</style>