import { Request, Response, NextFunction } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { getProvider } from '../config/providers';
import { ProviderType } from '../types/provider';

const getProxyConfig = () => {
  const { PROXY_HOST, PROXY_PORT, PROXY_USER, PROXY_PASS } = process.env;
  if (!PROXY_HOST || !PROXY_PORT) return undefined;
  return {
    host: PROXY_HOST,
    port: parseInt(PROXY_PORT, 10),
    auth: PROXY_USER && PROXY_PASS ? { username: PROXY_USER, password: PROXY_PASS } : undefined,
  };
};

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

// Retorna o token de verificação e os cookies da sessão (incluindo cookies do Cloudflare)
const getRequestVerificationToken = async (baseUrl: string): Promise<{ token: string; sessionCookies: string }> => {
  try {
    const response = await axios.get(`${baseUrl}/Login`, {
      headers: BROWSER_HEADERS,
      proxy: getProxyConfig(),
    });
    const $ = cheerio.load(response.data);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    if (!token) {
      throw new Error("Token de verificação não encontrado");
    }

    // Preservar todos os cookies retornados (cf_bm, cf_clearance, ASP.NET session, etc.)
    const rawCookies: string[] = response.headers["set-cookie"] ?? [];
    const sessionCookies = rawCookies
      .map((c) => c.split(";")[0])
      .join("; ");

    return { token, sessionCookies };
  } catch (error) {
    console.error("Erro ao obter token de verificação:", error);
    throw error;
  }
};

// Função de login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Declarar providerConfig fora do try para usar no catch também
  let providerConfig;

  try {
    console.log("[login] Recebendo requisição de login:", {
      method: req.method,
      path: req.path,
      body: {
        login: req.body.login ? "Fornecido" : "Não fornecido",
        password: req.body.password ? "Fornecido" : "Não fornecido",
        provider: req.body.provider || "elos (padrão)",
      },
    });

    const { login, password, provider = "elos" } = req.body;

    if (!login || !password) {
      res.status(400).json({ error: "Login e senha são obrigatórios" });
      return;
    }

    // Validar provider
    if (!['elos', 'evup', 'botosense'].includes(provider)) {
      res.status(400).json({ error: "Provider inválido. Use 'elos', 'evup' ou 'botosense'" });
      return;
    }

    // Obter configuração do provider
    providerConfig = getProvider(provider as ProviderType);
    console.log(`[login] Usando provider: ${providerConfig.name} (${providerConfig.baseUrl})`);

    // Obter o token de verificação e cookies da sessão (incluindo cookies do Cloudflare)
    const { token, sessionCookies } = await getRequestVerificationToken(providerConfig.baseUrl);
    console.log("Token de verificação obtido com sucesso");

    // Preparar dados do fingerprint
    const fingerPrint = {
      OS: "OS X",
      BrowserName: "Chrome",
      BrowserInfo: "135.0.0.0 - 64 bits",
      IpAddress: "127.0.0.1",
    };

    // Preparar dados para a requisição de login
    const formData = new URLSearchParams({
      FingerPrint: JSON.stringify(fingerPrint),
      IsEvupProvider: "False",
      Login: login,
      Password: password,
      __RequestVerificationToken: token,
      RememberMe: "false",
    });

    // Fazer a requisição de login propagando os cookies da sessão anterior
    const loginResponse = await axios.post(`${providerConfig.baseUrl}/Login`, formData, {
      headers: {
        ...BROWSER_HEADERS,
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": `${providerConfig.baseUrl}/Login`,
        "Origin": providerConfig.baseUrl,
        ...(sessionCookies ? { "Cookie": sessionCookies } : {}),
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      proxy: getProxyConfig(),
    });

    // Verificar se o login foi bem-sucedido
    const cookies = loginResponse.headers["set-cookie"];

    if (!cookies) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    // Extrair o cookie de autenticação
    const authCookie = cookies.find((cookie: string) =>
      cookie.includes("Authentication=")
    );

    if (!authCookie) {
      res.status(401).json({ error: "Token de autenticação não encontrado" });
      return;
    }

    // Extrair apenas o valor do token de autenticação
    const authToken = authCookie.split(";")[0].replace("Authentication=", "");

    // Retornar o token de autenticação
    res.status(200).json({
      success: true,
      token: authToken,
      provider: providerConfig.name,
      message: "Login realizado com sucesso",
    });
  } catch (error: any) {
    console.error("Erro durante o login:", error);

    // Verificar se é um erro de redirecionamento (geralmente indica login bem-sucedido)
    if (axios.isAxiosError(error) && error.response?.status === 302) {
      const cookies = error.response.headers["set-cookie"];

      if (cookies) {
        const authCookie = cookies.find((cookie: string) =>
          cookie.includes("Authentication=")
        );

        if (authCookie) {
          const authToken = authCookie
            .split(";")[0]
            .replace("Authentication=", "");

          res.status(200).json({
            success: true,
            token: authToken,
            provider: providerConfig?.name || "Desconhecido",
            message: "Login realizado com sucesso",
          });
          return;
        }
      }
    }

    res.status(500).json({
      error: "Erro durante o processo de login",
      details: error.message,
    });
  }
};
