<template>
    <div>
      <Navbar />
      <div class="hero-section">
        <div class="hero-content">
          <h1>VideoAI</h1>
          <p class="tagline">Genera immagini e video straordinari tramite intelligenza artificiale</p>
          <div class="cta-buttons">
            <button @click="navigateTo('/images')" class="btn-primary">Crea Immagini</button>
            <button @click="navigateTo('/videos')" class="btn-secondary">Crea Video</button>
          </div>
        </div>
        <div class="hero-illustration">
          <div class="illustration-container">
            <!-- SVG Illustrazione decorativa -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
              <!-- Sfondo -->
              <rect width="600" height="400" fill="#f8f9fa" rx="20" ry="20" />
              
              <!-- Rappresentazione simbolica UI app -->
              <rect x="50" y="50" width="500" height="300" rx="10" ry="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
              
              <!-- Header simbolico -->
              <rect x="50" y="50" width="500" height="60" rx="10" ry="10" fill="#4361ee" />
              <circle cx="85" cy="80" r="15" fill="#ffffff" opacity="0.8" />
              <rect x="115" y="70" width="120" height="20" rx="5" ry="5" fill="#ffffff" opacity="0.6" />
              <rect x="380" y="70" width="140" height="20" rx="10" ry="10" fill="#ffffff" opacity="0.4" />
              
              <!-- Area immagine principale -->
              <rect x="70" y="130" width="260" height="200" rx="5" ry="5" fill="#e2e8f0" />
              <path d="M70,250 L170,180 L240,230 L290,160 L330,330" stroke="#4cc9f0" stroke-width="3" fill="none" />
              <circle cx="170" cy="180" r="10" fill="#4361ee" />
              <circle cx="240" cy="230" r="10" fill="#4361ee" />
              <circle cx="290" cy="160" r="10" fill="#4361ee" />
              
              <!-- Area controlli -->
              <rect x="350" y="130" width="180" height="50" rx="5" ry="5" fill="#e2e8f0" />
              <rect x="360" y="140" width="160" height="30" rx="15" ry="15" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
              <circle cx="380" cy="155" r="10" fill="#4361ee" />
              
              <!-- Slider rappresentativi -->
              <rect x="350" y="190" width="180" height="20" rx="10" ry="10" fill="#e2e8f0" />
              <rect x="350" y="190" width="100" height="20" rx="10" ry="10" fill="#4cc9f0" />
              <circle cx="450" cy="200" r="10" fill="#ffffff" stroke="#4cc9f0" stroke-width="2" />
              
              <rect x="350" y="220" width="180" height="20" rx="10" ry="10" fill="#e2e8f0" />
              <rect x="350" y="220" width="140" height="20" rx="10" ry="10" fill="#4cc9f0" />
              <circle cx="490" cy="230" r="10" fill="#ffffff" stroke="#4cc9f0" stroke-width="2" />
              
              <!-- Pulsante -->
              <rect x="350" y="260" width="180" height="40" rx="20" ry="20" fill="#4361ee" />
              <rect x="400" y="275" width="80" height="10" rx="5" ry="5" fill="#ffffff" opacity="0.8" />
              
              <!-- Linee creative dinamiche -->
              <path d="M10,100 Q300,20 590,80" stroke="#f72585" stroke-width="2" fill="none" />
              <path d="M10,380 Q300,450 590,330" stroke="#4361ee" stroke-width="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="features-section">
        <h2>Possibilità Creative Illimitate</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Genera Immagini Incredibili</h3>
            <p>Trasforma le tue descrizioni testuali in immagini straordinarie grazie a Stable Diffusion, uno dei più potenti modelli AI per la generazione di immagini.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎬</div>
            <h3>Crea Video con l'AI</h3>
            <p>Dai vita alle tue idee con la nostra innovativa funzionalità di generazione video, che trasforma le tue descrizioni in brevi clip animate.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💎</div>
            <h3>Migliora la Qualità</h3>
            <p>Usa strumenti di upscaling per incrementare la risoluzione delle tue immagini e renderle ancora più dettagliate e definite.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💫</div>
            <h3>Stili Personalizzati</h3>
            <p>Scegli tra diversi stili preimpostati o crea il tuo stile unico con prompt dettagliati per ottenere esattamente l'estetica che desideri.</p>
          </div>
        </div>
      </div>
      
      <div class="examples-section">
        <h2>Cosa Puoi Creare</h2>
        <div class="examples-tabs">
          <button 
            @click="activeTab = 'images'" 
            :class="{ active: activeTab === 'images' }"
          >
            Immagini
          </button>
          <button 
            @click="activeTab = 'videos'" 
            :class="{ active: activeTab === 'videos' }"
          >
            Video
          </button>
        </div>
        <div class="examples-content">
          <div v-if="activeTab === 'images'" class="example-grid">
            <div class="example-item">
              <div class="example-preview image-preview bg-artwork">
                <!-- Placeholder per immagine -->
              </div>
              <div class="example-details">
                <h4>Arte Digitale</h4>
                <p class="example-prompt">"Paesaggio futuristico con città fluttuanti e astronavi, stile artistico digitale, dettagliato"</p>
              </div>
            </div>
            <div class="example-item">
              <div class="example-preview image-preview bg-portrait">
                <!-- Placeholder per immagine -->
              </div>
              <div class="example-details">
                <h4>Ritratto Stilizzato</h4>
                <p class="example-prompt">"Ritratto in stile cyberpunk di un guerriero con impianti tecnologici, luci al neon, pioggia"</p>
              </div>
            </div>
            <div class="example-item">
              <div class="example-preview image-preview bg-landscape">
                <!-- Placeholder per immagine -->
              </div>
              <div class="example-details">
                <h4>Paesaggio Fantasy</h4>
                <p class="example-prompt">"Montagne fluttuanti con cascate e templi antichi, nebbia mattutina, stile fantasy, illuminazione dorata"</p>
              </div>
            </div>
          </div>
          <div v-else class="example-grid">
            <div class="example-item">
              <div class="example-preview video-preview bg-cascade">
                <!-- Placeholder per video -->
                <div class="play-icon">▶</div>
              </div>
              <div class="example-details">
                <h4>Natura in Movimento</h4>
                <p class="example-prompt">"Cascata nella foresta pluviale, foglie che cadono, raggi di sole, cinematico"</p>
              </div>
            </div>
            <div class="example-item">
              <div class="example-preview video-preview bg-space">
                <!-- Placeholder per video -->
                <div class="play-icon">▶</div>
              </div>
              <div class="example-details">
                <h4>Viaggio Spaziale</h4>
                <p class="example-prompt">"Astronave che viaggia attraverso un campo di asteroidi, stelle brillanti sullo sfondo, stile 3D"</p>
              </div>
            </div>
            <div class="example-item">
              <div class="example-preview video-preview bg-abstract">
                <!-- Placeholder per video -->
                <div class="play-icon">▶</div>
              </div>
              <div class="example-details">
                <h4>Visualizzazione Astratta</h4>
                <p class="example-prompt">"Particelle di luce che danzano formando motivi caleidoscopici, colori cangianti, fluido"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <h2>Inizia a Creare Oggi Stesso</h2>
        <p>Trasforma le tue idee in contenuti visivi straordinari con VideoAI.</p>
        <div class="cta-buttons">
          <button @click="navigateTo('/images')" class="btn-primary">Genera Immagini</button>
          <button @click="navigateTo('/videos')" class="btn-secondary">Crea Video</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import Navbar from '../components/NavBar.vue';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const activeTab = ref('images');
  
  const navigateTo = (path) => {
    if (authStore.isAuthenticated) {
      router.push(path);
    } else {
      router.push('/login');
    }
  };
  </script>
  
  <style scoped>
  .hero-section {
    display: flex;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
    background: linear-gradient(135deg, var(--light) 0%, var(--gray-100) 100%);
  }
  
  .hero-content {
    flex: 1;
    padding: 2rem;
  }
  
  .hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, var(--primary) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .tagline {
    font-size: 1.5rem;
    color: var(--gray-700);
    margin-bottom: 2rem;
    max-width: 600px;
  }
  
  .hero-illustration {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  
  .illustration-container {
    width: 100%;
    max-width: 600px;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .btn-primary {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    background-color: var(--secondary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-secondary:hover {
    background-color: var(--info);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  .features-section {
    padding: 4rem 2rem;
    background-color: white;
    text-align: center;
  }
  
  .features-section h2 {
    margin-bottom: 3rem;
    font-size: 2.5rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    padding: 2rem;
    background-color: var(--gray-100);
    border-radius: var(--border-radius);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    margin-bottom: 1rem;
    color: var(--primary);
  }
  
  .examples-section {
    padding: 4rem 2rem;
    background-color: var(--gray-100);
  }
  
  .examples-section h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }
  
  .examples-tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .examples-tabs button {
    padding: 0.75rem 2rem;
    background-color: white;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .examples-tabs button.active {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .example-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .example-item {
    background-color: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s;
  }
  
  .example-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .example-preview {
    height: 200px;
    position: relative;
  }
  
  .image-preview, .video-preview {
    background-size: cover;
    background-position: center;
  }
  
  /* Sfondi di placeholder per le demo */
  .bg-artwork {
    background-image: linear-gradient(135deg, #6366f1 0%, #2dd4bf 100%);
  }
  
  .bg-portrait {
    background-image: linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%);
  }
  
  .bg-landscape {
    background-image: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  }
  
  .bg-cascade {
    background-image: linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%);
  }
  
  .bg-space {
    background-image: linear-gradient(135deg, #1e293b 0%, #4f46e5 100%);
  }
  
  .bg-abstract {
    background-image: linear-gradient(135deg, #ec4899 0%, #eab308 100%);
  }
  
  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--primary);
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .play-icon:hover {
    background-color: white;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  .example-details {
    padding: 1.5rem;
  }
  
  .example-details h4 {
    margin-bottom: 0.5rem;
    color: var(--gray-800);
  }
  
  .example-prompt {
    color: var(--gray-600);
    font-size: 0.9rem;
    font-style: italic;
  }
  
  .cta-section {
    padding: 6rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    color: white;
  }
  
  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .cta-section p {
    margin-bottom: 2rem;
    font-size: 1.2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-section .btn-primary {
    background-color: white;
    color: var(--primary);
  }
  
  .cta-section .btn-primary:hover {
    background-color: var(--gray-100);
  }
  
  .cta-section .btn-secondary {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }
  
  .cta-section .btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    .hero-section {
      flex-direction: column;
      text-align: center;
    }
    
    .hero-content h1 {
      font-size: 2.5rem;
    }
    
    .tagline {
      font-size: 1.2rem;
    }
    
    .cta-buttons {
      justify-content: center;
    }
    
    .features-grid, .example-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>