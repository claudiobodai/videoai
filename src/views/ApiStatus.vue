<template>
    <div>
      <Navbar />
      <div class="api-status-page">
        <div class="page-header">
          <h1>Stato delle API</h1>
          <p class="subheading">
            Questa pagina mostra lo stato attuale delle API integrate nell'applicazione.
          </p>
        </div>
        
        <div class="status-section">
          <div class="status-card" :class="{ 'status-online': imageApiStatus.isOnline }">
            <div class="status-header">
              <h3>API Generazione Immagini</h3>
              <div class="status-indicator">
                <span class="status-dot" :class="{ 'online': imageApiStatus.isOnline, 'offline': !imageApiStatus.isOnline }"></span>
                <span>{{ imageApiStatus.isOnline ? 'Online' : 'Offline' }}</span>
              </div>
            </div>
            <div class="status-body">
              <p><strong>Provider:</strong> Hugging Face Stable Diffusion</p>
              <p><strong>Ultimo controllo:</strong> {{ formatDate(imageApiStatus.lastCheck) }}</p>
              <p><strong>Dettagli:</strong> {{ imageApiStatus.message }}</p>
              
              <div class="api-features">
                <h4>Funzionalità disponibili</h4>
                <ul>
                  <li><span class="feature-check">✓</span> Generazione di immagini da descrizione testuale</li>
                  <li><span class="feature-check">✓</span> Controllo della fedeltà al prompt</li>
                  <li><span class="feature-check">✓</span> Miglioramento della risoluzione</li>
                  <li><span class="feature-check">✓</span> Prompt negativi per escludere elementi indesiderati</li>
                </ul>
              </div>
            </div>
            <div class="status-footer">
              <button @click="checkImageApiStatus" class="check-btn">
                <span v-if="checkingImage" class="loading-spinner"></span>
                Verifica stato
              </button>
              <router-link to="/images" class="use-api-btn">Usa questa API</router-link>
            </div>
          </div>
          
          <div class="status-card status-beta">
            <div class="status-header">
              <h3>API Generazione Video</h3>
              <div class="status-indicator">
                <span class="status-dot beta"></span>
                <span>In sviluppo</span>
              </div>
            </div>
            <div class="status-body">
              <p><strong>Provider:</strong> API in fase di integrazione</p>
              <p><strong>Stato:</strong> Demo funzionante con video simulati</p>
              <p><strong>Dettagli:</strong> Stiamo valutando diverse soluzioni API per la generazione di video</p>
              
              <div class="api-features">
                <h4>Potenziali API in valutazione</h4>
                <ul>
                  <li><span class="feature-beta">○</span> Stable Diffusion Text-to-Video</li>
                  <li><span class="feature-beta">○</span> OpenSora (quando disponibile)</li>
                  <li><span class="feature-beta">○</span> Modello Wan2.1</li>
                  <li><span class="feature-beta">○</span> Altri modelli emergenti</li>
                </ul>
              </div>
            </div>
            <div class="status-footer">
              <router-link to="/videos" class="try-beta-btn">Prova la demo</router-link>
            </div>
          </div>
        </div>
        
        <div class="api-info-section">
          <h2>Informazioni sulle API</h2>
          <div class="info-text">
            <p>Le API di intelligenza artificiale per la generazione di contenuti sono in rapida evoluzione. La nostra applicazione utilizza attivamente l'API di Hugging Face per generare immagini con Stable Diffusion, mentre stiamo valutando diverse opzioni per la generazione di video.</p>
            <p>Se hai suggerimenti su altre API che potremmo integrare o se hai riscontrato problemi con quelle attuali, non esitare a contattarci.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Navbar from '../components/NavBar.vue';
  import { checkApiStatus } from '../services/imageService';
  
  // Stato API immagini
  const imageApiStatus = ref({
    isOnline: false,
    lastCheck: new Date(),
    message: 'Nessun controllo effettuato'
  });
  
  const checkingImage = ref(false);
  
  // Controlla lo stato dell'API per le immagini
  const checkImageApiStatus = async () => {
    checkingImage.value = true;
    try {
      const status = await checkApiStatus();
      imageApiStatus.value = {
        isOnline: status.status === 'online' || status.status === 'limited',
        lastCheck: new Date(),
        message: status.message || 'API disponibile'
      };
    } catch (error) {
      imageApiStatus.value = {
        isOnline: false,
        lastCheck: new Date(),
        message: 'Errore durante il controllo: ' + (error.message || 'Errore sconosciuto')
      };
    } finally {
      checkingImage.value = false;
    }
  };
  
  // Formatta la data
  const formatDate = (date) => {
    return new Date(date).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Controlla lo stato API all'avvio
  onMounted(() => {
    checkImageApiStatus();
  });
  </script>
  
  <style scoped>
  .api-status-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .subheading {
    max-width: 700px;
    margin: 0 auto;
    color: var(--gray-600);
    font-size: 1.1rem;
  }
  
  .status-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .status-card {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    border-top: 6px solid var(--gray-400);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .status-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .status-online {
    border-top-color: var(--success);
  }
  
  .status-beta {
    border-top-color: var(--warning);
  }
  
  .status-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .status-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--gray-400);
  }
  
  .status-dot.online {
    background-color: var(--success);
    box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
  }
  
  .status-dot.offline {
    background-color: var(--danger);
    box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.2);
  }
  
  .status-dot.beta {
    background-color: var(--warning);
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.2);
  }
  
  .status-body {
    padding: 1.5rem;
    flex-grow: 1;
  }
  
  .api-features {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--gray-200);
  }
  
  .api-features h4 {
    margin-bottom: 0.75rem;
    color: var(--gray-700);
  }
  
  .api-features ul {
    list-style: none;
    padding: 0;
  }
  
  .api-features li {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
  
  .feature-check {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background-color: var(--success);
    color: white;
    border-radius: 50%;
    margin-right: 0.75rem;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .feature-beta {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    background-color: var(--warning);
    color: white;
    border-radius: 50%;
    margin-right: 0.75rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .status-footer {
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    border-top: 1px solid var(--gray-200);
    background-color: var(--gray-50);
  }
  
  .check-btn {
    padding: 0.75rem 1rem;
    background-color: var(--gray-200);
    color: var(--gray-700);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s;
  }
  
  .check-btn:hover {
    background-color: var(--gray-300);
  }
  
  .use-api-btn, .try-beta-btn {
    padding: 0.75rem 1rem;
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: 500;
    flex-grow: 1;
    text-align: center;
    transition: all 0.3s;
  }
  
  .use-api-btn {
    background-color: var(--primary);
    color: white;
  }
  
  .use-api-btn:hover {
    background-color: var(--primary-dark);
  }
  
  .try-beta-btn {
    background-color: var(--warning);
    color: white;
  }
  
  .try-beta-btn:hover {
    background-color: #e0a800;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--gray-700);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .api-info-section {
    background-color: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
  }
  
  .api-info-section h2 {
    margin-bottom: 1rem;
    text-align: center;
    color: var(--gray-800);
  }
  
  .info-text {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
  }
  
  .info-text p {
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .api-status-page {
      padding: 1rem;
    }
    
    .status-section {
      grid-template-columns: 1fr;
    }
    
    .status-footer {
      flex-direction: column;
    }
  }
  </style>