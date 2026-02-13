import { By, until, WebElement } from "selenium-webdriver";
import { startSelenium, stopSelenium } from "../selenium/driver";

type Product = {
  title: string;
  url: string;
};

export async function getProducts(limit = 20): Promise<Product[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 20;

  const driver = await startSelenium({ headless: true });

  try {
    await driver.get(process.env.ML_URL as string);

    // Exemplo genérico: você vai ajustar o seletor pra página real
    const cards: WebElement[] = await driver.wait(
      until.elementsLocated(By.css("a")), // troque por um seletor de card de produto
      15_000
    );

    const results: Product[] = [];

    for (const el of cards) {
      if (results.length >= safeLimit) break;

      const url = (await el.getAttribute("href")) || "";
      const title = (await el.getText())?.trim() || "";

      // filtra lixo
      if (!url || !title) continue;

      results.push({ title, url });
    }

    return results;
  } catch (error) {
    console.error("Erro ao acessar o site:", error);
    return [];
  } finally {
    await stopSelenium();
  }
}