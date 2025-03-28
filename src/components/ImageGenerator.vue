<template>
  <div class="image-generator">
    <h2>Generatore di Immagini con AI</h2>
    
    <div class="generator-form">
      <div class="input-group">
        <label for="prompt">Descrivi l'immagine che vuoi generare:</label>
        <textarea 
          id="prompt" 
          v-model="prompt" 
          placeholder="Es. Un gatto cosmonauta nello spazio, stile manga digitale, dettagliato, colori vivaci"
          rows="3"
        ></textarea>
      </div>
      
      <div class="options">
        <div class="input-group">
          <label for="negativePrompt">Prompt negativo (cosa escludere):</label>
          <input 
            id="negativePrompt" 
            v-model="negativePrompt" 
            placeholder="Es. bassa qualità, sfocato, distorto"
          />
        </div>
        
        <div class="input-row">
          <div class="input-group">
            <label for="guidanceScale">Fedeltà al prompt (1-20):</label>
            <input 
              type="range" 
              id="guidanceScale" 
              v-model="guidanceScale" 
              min="1" 
              max="20" 
              step="0.5"
            />
            <span>{{ guidanceScale }}</span>
          </div>
          
          <div class="input-group">
            <label for="steps">Steps (10-50):</label>
            <input 
              type="range" 
              id="steps" 
              v-model="steps" 
              min="10" 
              max="50" 
              step="1"
            />
            <span>{{ steps }}</span>
          </div>
        </div>
      </div>
      
      <button 
        @click="generateImage" 
        :disabled="loading || !prompt.trim()"
        class="generate-btn"
      >
        <span v-if="loading" class="loader"></span>
        <span>{{ loading ? 'Generazione in corso...' : 'Genera Immagine' }}</span>
      </button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="generatedImage" class="result-container">
      <h3>Immagine Generata</h3>
      <div class="image-result">
        <img :src="generatedImage.result.output_url" alt="Immagine generata dall'AI" />
      </div>
      <div class="image-info">
        <p><strong>Prompt:</strong> {{ generatedImage.prompt }}</p>
        <p><strong>Modello:</strong> {{ generatedImage.result.model }}</p>
        <p><strong>Creata:</strong> {{ formatDate(generatedImage.createdAt) }}</p>
      </div>
      <div class="actions">
        <button @click="downloadImage" class="action-btn">
          <span class="icon">↓</span> Scarica
        </button>
        <button @click="enhanceImage" class="action-btn" :disabled="enhancing">
          <span v-if="enhancing" class="loader small"></span>
          <span>{{ enhancing ? 'Miglioramento in corso...' : 'Migliora Risoluzione' }}</span>
        </button>
      </div>
    </div>
    
    <div v-if="generatedImages.length > 0" class="gallery">
      <h3>Le tue immagini generate</h3>
      <div class="images-grid">
        <div 
          v-for="image in generatedImages" 
          :key="image.id" 
          class="gallery-item"
          @click="selectImage(image)"
        >
          <img :src="image.result.output_url" :alt="image.prompt" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateImageWithStableDiffusion, enhanceImageResolution } from '../services/huggingface';

// Stato
const prompt = ref('');
const negativePrompt = ref('bassa qualità, sfocato, distorto, pixelato');
const guidanceScale = ref(7.5);
const steps = ref(30);
const loading = ref(false);
const enhancing = ref(false);
const error = ref('');
const generatedImage = ref(null);
const generatedImages = ref([]);

// Formatta la data
const formatDate = (date) => {
  return new Date(date).toLocaleString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Carica le immagini salvate all'avvio del componente
onMounted(() => {
  const savedImages = localStorage.getItem('generatedImages');
  if (savedImages) {
    generatedImages.value = JSON.parse(savedImages);
    if (generatedImages.value.length > 0) {
      generatedImage.value = generatedImages.value[0];
    }
  }
});

// Genera una nuova immagine
const generateImage = async () => {
  if (!prompt.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const result = await generateImageWithStableDiffusion(prompt.value);
    
    // Creazione dell'oggetto immagine
    const newImage = {
      id: Date.now().toString(),
      prompt: prompt.value,
      negativePrompt: negativePrompt.value,
      guidanceScale: guidanceScale.value,
      steps: steps.value,
      result: result,
      createdAt: new Date()
    };
    
    // Aggiungi alla lista e seleziona
    generatedImages.value.unshift(newImage);
    generatedImage.value = newImage;
    
    // Salva nel localStorage
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages.value));
    
  } catch (err) {
    error.value = 'Si è verificato un errore durante la generazione dell\'immagine. Riprova più tardi.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Migliora la risoluzione dell'immagine
const enhanceImage = async () => {
  if (!generatedImage.value || !generatedImage.value.result.output_url) return;
  
  enhancing.value = true;
  
  try {
    const result = await enhanceImageResolution(generatedImage.value.result.output_url);
    
    // Aggiorna l'immagine corrente
    generatedImage.value = {
      ...generatedImage.value,
      result: result,
      enhancedAt: new Date()
    };
    
    // Aggiorna anche nella lista
    const index = generatedImages.value.findIndex(img => img.id === generatedImage.value.id);
    if (index !== -1) {
      generatedImages.value[index] = generatedImage.value;
      localStorage.setItem('generatedImages', JSON.stringify(generatedImages.value));
    }
    
  } catch (err) {
    error.value = 'Si è verificato un errore durante il miglioramento dell\'immagine.';
    console.error(err);
  } finally {
    enhancing.value = false;
  }
};

// Scarica l'immagine
const downloadImage = () => {
  if (!generatedImage.value || !generatedImage.value.result.output_url) return;
  
  const link = document.createElement('a');
  link.href = generatedImage.value.result.output_url;
  link.download = `ai-image-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Seleziona un'immagine dalla galleria
const selectImage = (image) => {
  generatedImage.value = image;
};
</script>

<style scoped>
.image-generator {
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

.input-group textarea,
.input-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
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

.image-result {
  margin: 1rem 0;
  text-align: center;
}

.image-result img {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.image-info {
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

.action-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.action-btn:disabled {
  background-color: var(--gray-400);
  cursor: not-allowed;
}

.icon {
  font-weight: bold;
}

.gallery {
  margin-top: 3rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-item {
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  height: 150px;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.loader.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>