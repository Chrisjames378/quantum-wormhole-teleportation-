import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/quantum/copilot
app.post('/api/quantum/copilot', async (req, res) => {
  try {
    const { question, qubits, scrambler, fidelity, noise } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!ai) {
      return res.status(503).json({
        answer:
          'Gemini API key is not configured in the environment. Please ensure GEMINI_API_KEY is available in the secrets configuration.',
      });
    }

    const systemInstruction = `You are the Quantum AI Co-pilot for the Quantum Wormhole Teleportation Playground.
You are a world-class theoretical physicist specializing in:
1. The Hayden-Preskill black hole information retrieval protocol & Yoshida-Kitaev traversable wormholes.
2. The ER=EPR conjecture (Maldacena, Shenker, Stanford).
3. Quantum resource theory of magic, stabilizer states, Clifford groups, and the Gottesman-Knill theorem.
4. The seminal research paper by Sudhanva Joshi & Sunil Kumar Mishra (IIT Banaras Hindu University, 2026), titled "Testing Clifford vs Haar Scrambling in Hayden-Preskill Wormhole Protocols".

Current Active Experiment Context:
- Qubit Count (N): ${qubits || 4} qubits
- Scrambler Type: ${scrambler ? scrambler.toUpperCase() : 'CLIFFORD'}
- Measured Teleportation Fidelity: ${fidelity ? (fidelity * 100).toFixed(2) + '%' : 'N/A'}
- Environmental Noise: ${noise?.enabled ? `Active (T1 decay=${noise.amplitudeDamping}, T2 dephasing=${noise.phaseDamping}, Depolarizing=${noise.depolarizing})` : 'Zero Noise (Ideal Unitary)'}

Guidelines for your answers:
- Provide rigorous, clear, and mathematically accurate explanations.
- Emphasize the core Joshi & Mishra (2026) result: Clifford scramblers form exact unitary 2-designs and 3-designs, matching Haar average fidelity despite having zero magic (T-count = 0); but fail as 4-designs, leading to high trial-to-trial variance at small N (up to ~40,000x Haar variance at N=2 to 4) that decays exponentially as N -> 16.
- Keep answers structured with clear sections or key bullet points. Do not exceed 250 words unless detailed mathematical steps are explicitly asked.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const answer = response.text || 'Unable to generate explanation from model.';
    res.json({ answer });
  } catch (error: any) {
    console.error('Gemini Co-pilot error:', error);
    res.status(500).json({
      error: 'Failed to process explanation query',
      details: error.message || String(error),
    });
  }
});

// Vite Middleware for Full-Stack Applet
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quantum Teleportation server listening on port ${PORT}`);
  });
}

startServer();
