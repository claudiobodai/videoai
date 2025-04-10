import axios from 'axios';

// L'URL verrà impostato dinamicamente (es. tramite ngrok)
// Inizialmente vuoto, così da costringere l'utente a impostarlo tramite setWan21ApiUrl()
let WAN21_API_URL = '';

/**
 * Imposta l'URL di base dell'API Wan2.1 (ad esempio, l'URL ngrok esposto da Flask su Google Colab)
 * @param {string} url - URL completo dell'API (es. https://bead-35-197-47-34.ngrok-free.app)
 */
export const setWan21ApiUrl = (url) => {
  WAN21_API_URL = url;
  console.log('Wan2.1 API URL impostato:', url);
  return true;
};

/**
 * Genera un video tramite l'API Wan2.1
 * @param {string} prompt - Testo descrittivo del video da generare
 * @param {Object} options - Opzioni aggiuntive (es. risoluzione, sample_shift, guide_scale)
 * @returns {Promise} - Promise che risolve con il risultato finale del job
 */
export const generateVideoWithWan21 = async (prompt, options = {}) => {
  try {
    if (!WAN21_API_URL) {
      throw new Error('URL API Wan2.1 non impostato. Usa prima setWan21ApiUrl()');
    }

    // Prepara i dati della richiesta
    const requestData = {
      prompt,
      resolution: options.resolution || '832*480',
      sample_shift: options.sampleShift || 8,
      guide_scale: options.guideScale || 6
    };

    // Effettua la richiesta di generazione
    const response = await axios.post(`${WAN21_API_URL}/generate`, requestData);

    // Avvia il polling per controllare lo stato del job
    return pollVideoStatus(response.data.job_id);
  } catch (error) {
    console.error('Errore durante la richiesta a Wan2.1:', error);
    throw error;
  }
};

/**
 * Esegue il polling sullo stato del job finché il video non viene completato o fallisce
 * @param {string} jobId - ID del job di generazione restituito dall’API
 * @returns {Promise} - Risultato finale contenente l’output_url e altre informazioni
 */
const pollVideoStatus = async (jobId) => {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${WAN21_API_URL}/status/${jobId}`);
        const data = response.data;

        if (data.status === 'completed') {
          resolve({
            output_url: data.output_url,
            model: data.model || 'Wan2.1-T2V-1.3B',
            status: 'completed'
          });
        } else if (data.status === 'failed') {
          reject(new Error(data.error || 'Generazione video fallita'));
        } else {
          // Il job non è ancora terminato: controlla nuovamente dopo 3 secondi
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        reject(error);
      }
    };

    // Avvia il controllo dello stato
    checkStatus();
  });
};
