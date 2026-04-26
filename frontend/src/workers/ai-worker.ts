import { pipeline, env } from '@xenova/transformers';

// Skip local model check and use remote CDN (Hugging Face)
env.allowLocalModels = false;

let extractor: any = null;

const SECTIONS = [
  { id: 'home', text: 'home main page introduction bio who are you system init' },
  { id: 'skills', text: 'skills technical arsenal technologies programming languages stack tools' },
  { id: 'experience', text: 'experience work work history jobs sys logs professional background' },
  { id: 'education', text: 'education university degree training data studies school' },
  { id: 'contact', text: 'contact email message open channel hire reach out' }
];

let sectionEmbeddings: any[] = [];

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]) {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    mA += a[i] * a[i];
    mB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}

async function init() {
  if (extractor) return;
  
  self.postMessage({ type: 'status', message: 'LOADING_NEURAL_WEIGHTS' });
  
  extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  self.postMessage({ type: 'status', message: 'GENERATING_VECTOR_SPACE' });
  
  // Pre-calculate embeddings for sections
  for (const section of SECTIONS) {
    const output = await extractor(section.text, { pooling: 'mean', normalize: true });
    sectionEmbeddings.push({ id: section.id, embedding: Array.from(output.data) });
  }
  
  self.postMessage({ type: 'status', message: 'NEURAL_PROCESSOR_READY' });
}

self.onmessage = async (e) => {
  const { type, text } = e.data;
  
  if (type === 'init') {
    await init();
  } else if (type === 'query') {
    if (!extractor) await init();
    
    self.postMessage({ type: 'thought', message: `Analyzing intent: "${text}"` });
    
    // Generate embedding for query
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data) as number[];
    
    // Calculate similarities
    const results = sectionEmbeddings.map(section => {
      const score = cosineSimilarity(queryEmbedding, section.embedding);
      return { id: section.id, score };
    }).sort((a, b) => b.score - a.score);
    
    self.postMessage({ type: 'thought', message: `Vector comparison complete. Top match: ${results[0].id} (${(results[0].score * 100).toFixed(1)}%)` });
    
    // Send back the best match
    self.postMessage({ 
      type: 'result', 
      bestMatch: results[0],
      allScores: results 
    });
  }
};
