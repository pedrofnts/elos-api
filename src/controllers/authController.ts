import { Request, Response, NextFunction } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { getProvider } from '../config/providers';
import { ProviderType } from '../types/provider';

// Função para obter o token de verificação
const getRequestVerificationToken = async (baseUrl: string): Promise<string> => {
  try {
    const response = await axios.get(`${baseUrl}/Login`);
    const $ = cheerio.load(response.data);
    const token = $('input[name="__RequestVerificationToken"]').val() as string;

    if (!token) {
      throw new Error("Token de verificação não encontrado");
    }

    return token;
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

    // Obter o token de verificação
    const token = await getRequestVerificationToken(providerConfig.baseUrl);
    console.log("Token de verificação obtido com sucesso");

    // Preparar dados do fingerprint
    const fingerPrint = {
      OS: "OS X",
      BrowserName: "Chrome",
      BrowserInfo: "135.0.0.0 - 64 bits",
      IpAddress: "127.0.0.1", // O IP real será determinado pelo servidor
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

    // Fazer a requisição de login
    const loginResponse = await axios.post(`${providerConfig.baseUrl}/Login`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "Referer": `${providerConfig.baseUrl}/Login`,
        "Origin": providerConfig.baseUrl,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
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
