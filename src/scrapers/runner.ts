import type { Job } from "../types/job";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let running = false;

export function startJobsRunner(jobs: Job[], intervalMinutes = 10) {
  const intervalMs = intervalMinutes * 60_000;

  const cycle = async () => {
    if (running) return; // evita overlap caso o ciclo demore mais que o intervalo
    running = true;

    try {
      for (const job of jobs) {
        const start = Date.now();
        console.log(`[jobs] Iniciando: ${job.name}`);

        try {
          await job.run(); // ✅ garante que roda um após o outro
          const secs = ((Date.now() - start) / 1000).toFixed(1);
          console.log(`[jobs] Finalizado: ${job.name} (${secs}s)`);
        } catch (err) {
          console.error(`[jobs] Erro no job ${job.name}:`, err);
          // segue para o próximo job mesmo com erro
        }
      }
    } finally {
      running = false;
    }
  };

  // roda uma vez ao subir
  cycle();

  // agenda os ciclos
  setInterval(cycle, intervalMs);

  console.log(`[jobs] Runner ligado. Ciclo a cada ${intervalMinutes} min`);
}