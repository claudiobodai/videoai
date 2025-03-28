<template>
  <div>
    <Navbar />
    <div class="images-page">
      <div class="page-header">
        <h1>Generatore Avanzato di Immagini</h1>
        <p class="subheading">
          Descrivi l'immagine che hai in mente e lascia che l'AI la crei per te.
          Utilizza prompt dettagliati per ottenere risultati migliori.
        </p>
      </div>
      
      <ImageGenerator />
      
      <div class="tips-section">
        <h3>Suggerimenti per ottenere immagini migliori</h3>
        <div class="tips-grid">
          <div class="tip-card">
            <h4>Sii specifico</h4>
            <p>Descrivi in dettaglio cosa vuoi vedere nell'immagine, inclusi soggetti, azioni, ambientazione e stile.</p>
          </div>
          <div class="tip-card">
            <h4>Specifica lo stile artistico</h4>
            <p>Aggiungi termini come "fotorealistico", "dipinto ad olio", "arte digitale", "stile manga" per influenzare il risultato.</p>
          </div>
          <div class="tip-card">
            <h4>Usa aggettivi descrittivi</h4>
            <p>Parole come "vibrante", "dettagliato", "cinematografico" o "high-resolution" possono migliorare la qualità.</p>
          </div>
          <div class="tip-card">
            <h4>Descrivere l'illuminazione</h4>
            <p>Termini come "illuminazione drammatica", "luce morbida", "tramonto" o "controluce" influenzano l'atmosfera.</p>
          </div>
        </div>
        
        <div class="prompt-examples">
          <h4>Esempi di prompt efficaci</h4>
          <ul>
            <li>
              <strong>Paesaggio:</strong> 
              "Un paesaggio montano all'alba, con un lago cristallino che riflette le vette innevate, nebbia leggera che si solleva dalla superficie dell'acqua, stile fotorealistico, illuminazione dorata, dettagliato"
            </li>
            <li>
              <strong>Personaggio:</strong> 
              "Un guerriero samurai in armatura tradizionale, sotto un ciliegio in fiore durante una tempesta, in stile anime dettagliato, espressione determinata, luce drammatica"
            </li>
            <li>
              <strong>Fantasia:</strong> 
              "Un castello di cristallo fluttuante tra le nuvole, con cascate che precipitano nell'abisso, drago iridescente che vola intorno alle torri, stile fantasy digitale, colori vivaci, dettagliato"
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/NavBar.vue';
import ImageGenerator from '../components/ImageGenerator.vue';
</script>

<style scoped>
.images-page {
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
  border-left: 4px solid var(--primary);
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
}

.prompt-examples ul {
  list-style-type: none;
  padding-left: 0;
}

.prompt-examples li {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .images-page {
    padding: 1rem;
  }
}
</style>