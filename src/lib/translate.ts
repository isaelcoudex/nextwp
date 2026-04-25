/**
 * Utilitário de tradução via DeepL Free API.
 * Cadastro gratuito em: https://deepl.com/pro (sem cartão, 500k chars/mês)
 * Defina DEEPL_API_KEY no .env.local para ativar.
 * Sem a chave, retorna o conteúdo original (PT).
 *
 * Cache duplo:
 *   1. Memória (Map) — ultrarrápido, por processo
 *   2. Arquivo JSON em <projeto>/.cache/deepl-cache.json — persiste entre reboots do servidor
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = "https://api-free.deepl.com/v2/translate";

// Salva dentro do projeto — persiste reboots do servidor
const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "deepl-cache.json");

// ── Cache em memória ──────────────────────────────────────────────
const memCache = new Map<string, string>();

// ── Cache em arquivo (carregado uma vez na inicialização) ─────────
let fileCache: Record<string, string> = {};
let fileCacheDirty = false; // controla se há dados novos para persistir

try {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (fs.existsSync(CACHE_FILE)) {
    fileCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  }
} catch {
  fileCache = {};
}

// Persiste o cache em disco a cada 30 segundos (batch write)
setInterval(() => {
  if (!fileCacheDirty) return;
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(fileCache), "utf-8");
    fileCacheDirty = false;
  } catch {
    // ignora erros de escrita (ex: /tmp read-only em alguns ambientes)
  }
}, 30_000);

function cacheKey(text: string, targetLang: string): string {
  // Hash MD5 do texto completo para evitar colisões
  return `${targetLang}::${crypto.createHash("md5").update(text).digest("hex")}`;
}

function getCache(key: string): string | undefined {
  return memCache.get(key) ?? fileCache[key];
}

function setCache(key: string, value: string): void {
  memCache.set(key, value);
  fileCache[key] = value;
  fileCacheDirty = true;
}

/**
 * Traduz texto puro para o idioma alvo.
 * targetLang: "EN", "ES", "FR" (maiúsculo, padrão DeepL)
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (!DEEPL_API_KEY || !text.trim() || targetLang.toUpperCase() === "PT")
    return text;

  const key = cacheKey(text, targetLang);
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        source_lang: "PT",
        target_lang: targetLang.toUpperCase(),
      }),
    });

    if (!res.ok) return text;
    const data = await res.json();
    const translated: string = data.translations?.[0]?.text || text;
    setCache(key, translated);
    return translated;
  } catch {
    return text;
  }
}

/**
 * Traduz HTML preservando as tags (DeepL entende HTML nativamente).
 * targetLang: "EN", "ES", "FR"
 */
export async function translateHtml(
  html: string,
  targetLang: string
): Promise<string> {
  if (!DEEPL_API_KEY || !html.trim() || targetLang.toUpperCase() === "PT")
    return html;

  const key = cacheKey(html, targetLang);
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const res = await fetch(DEEPL_URL, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [html],
        source_lang: "PT",
        target_lang: targetLang.toUpperCase(),
        tag_handling: "html",
      }),
    });

    if (!res.ok) return html;
    const data = await res.json();
    const translated: string = data.translations?.[0]?.text || html;
    setCache(key, translated);
    return translated;
  } catch {
    return html;
  }
}
