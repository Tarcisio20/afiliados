// src/jobs/mercadolivre.job.ts
import type { Job } from "../../types/job";
import { getProducts } from "./function";

let running = false;

export const mercadoLivreJob: Job = {
  name: "MercadoLivre",
  run: async () => {
    if (running) return; // evita rodar simultâneo
    running = true;

    const limit = Number(process.env.ML_PRODUCTS_LIMIT ?? 20);

    try {
      const products = await getProducts(limit);
      console.log(`[ML] Coletados: ${products.length}`);

      // TODO: salvar/processar no banco
    } catch (err) {
      console.error("[ML] Erro no job:", err);
    } finally {
      running = false;
    }
  },
};