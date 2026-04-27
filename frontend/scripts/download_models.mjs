import { pipeline, env } from '@xenova/transformers';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure to download to public/models
env.allowLocalModels = false; // Force download from remote
env.localModelPath = path.join(__dirname, '../public/models/');

async function download() {
    console.log('--- ATROCITY NEURAL ENGINE: PRE-DOWNLOADING WEIGHTS ---');
    try {
        // This will trigger a download and cache it locally in the specified path
        await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('SUCCESS: Models downloaded to public/models/');
    } catch (error) {
        console.error('FAILED to download models:', error);
        process.exit(1);
    }
}

download();
