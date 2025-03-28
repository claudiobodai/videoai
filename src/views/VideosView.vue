<template>
  <div>
    <Navbar />
    <div class="videos-page">
      <div class="page-header">
        <h1>Generatore di Video con AI</h1>
        <p class="subheading">
          Trasforma le tue idee in video dinamici utilizzando la più recente tecnologia AI.
          Descrivi ciò che vorresti vedere e lascia che l'AI si occupi del resto.
        </p>
      </div>
      
      <VideoGenerator />
      
      <div class="tips-section">
        <h3>Come ottenere i migliori risultati</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <h4>Descrivere l'azione</h4>
            <p>Concentrati sul movimento o l'azione principale che desideri vedere nel video. Usa verbi chiari come "cammina", "danza", "scorre", ecc.</p>
          </div>
          <div class="tip-card">
            <h4>Specifica l'ambientazione</h4>
            <p>Descrivi dove si svolge la scena: un paesaggio, in città, in uno studio, nello spazio, ecc. Più specifico sei, migliore sarà il risultato.</p>
          </div>
          <div class="tip-card">
            <h4>Definisci lo stile visivo</h4>
            <p>Usa i pulsanti di stile o includi termini come "cinematico", "animazione", "3D" o "realistico" per influenzare l'estetica del video.</p>
          </div>
          <div class="tip-card">
            <h4>Mantieni la semplicità</h4>
            <p>I video AI funzionano meglio con concetti semplici e chiari. Evita scene troppo complesse con più azioni simultanee.</p>
          </div>
        </div>
        
        <div class="prompt-examples">
          <h4>Esempi di prompt efficaci per video</h4>
          <div class="examples-grid">
            <div class="example-card">
              <h5>Natura</h5>
              <p>"Una cascata che scorre in una foresta tropicale lussureggiante, con foglie che cadono nell'acqua, raggi di sole che filtrano attraverso gli alberi"</p>
              <span class="tag">Cinematico</span>
            </div>
            <div class="example-card">
              <h5>Astratto</h5>
              <p>"Inchiostro colorato che si diffonde nell'acqua, creando motivi ipnotici e vorticosi, con particelle luminose che danzano nella miscela"</p>
              <span class="tag">Realistico</span>
            </div>
            <div class="example-card">
              <h5>Spazio</h5>
              <p>"Un'astronave che viaggia attraverso una nebulosa colorata, con stelle brillanti sullo sfondo e pianeti distanti che appaiono all'orizzonte"</p>
              <span class="tag">3D</span>
            </div>
            <div class="example-card">
              <h5>Personaggio</h5>
              <p>"Un giovane mago che lancia un incantesimo, con energia magica che fluisce dalle sue mani e si trasforma in creature fantastiche"</p>
              <span class="tag">Anime</span>
            </div>
          </div>
        </div>
        
        <div class="limitations">
          <h4>Limitazioni attuali</h4>
          <p>La generazione di video con AI è ancora in fase iniziale di sviluppo, quindi tieni presente che:</p>
          <ul>
            <li>I video generati sono brevi (tipicamente 3-5 secondi)</li>
            <li>I soggetti umani potrebbero apparire distorti o non naturali</li>
            <li>Testi e scritte non vengono riprodotti accuratamente</li>
            <li>Scene complesse con molti soggetti potrebbero risultare confuse</li>
            <li>La generazione richiede tempo (1-3 minuti per video)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/NavBar.vue';
import VideoGenerator from '../components/VideoGenerator.vue';
</script>

<style scoped>
.videos-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.subheading {
  max-width: 700px;
  margin: 0 auto;
  color: var(--gray-600);
  font-size: 1.1rem;
}

.tips-section {
  margin-top: 4rem;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.tips-section h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tip-card {
  padding: 1.5rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--secondary);
}

.tip-card h4 {
  margin-bottom: 0.75rem;
  color: var(--gray-800);
}

.prompt-examples {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
}

.prompt-examples h4 {
  margin-bottom: 1rem;
  color: var(--gray-800);
  text-align: center;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.example-card {
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.example-card h5 {
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--primary-light);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.limitations {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #fff5f5;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--danger);
}

.limitations h4 {
  color: var(--danger);
  margin-bottom: 1rem;
}

.limitations ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.limitations li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .tips-grid, .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .videos-page {
    padding: 1rem;
  }
}
</style>