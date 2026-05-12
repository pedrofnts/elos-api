import { Request, Response } from "express";
import axios from "axios";
import apiClient from '../services/apiClient';

// Função auxiliar para criar string de cookies
const createCookieString = (authToken: string, structureId: string = "58") => {
  return [
    `tz=America%2FMaceio`,
    `slot-routing-url=-`,
    `current-organizational-structure=${structureId}`,
    `_ga=GA1.1.1853101631.1733855667`,
    `_ga_H3Z1Q956EV=GS1.1.1738295739.7.0.1738295739.0.0.0`,
    `Authentication=${authToken}`,
  ].join("; ");
};

// Função para listar leads filtrados por data de criação
export const listFilteredLeads = async (req: Request, res: Response) => {
  try {
    console.log("[listFilteredLeads] Recebendo requisição:", {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers.authorization
        ? "Com Authorization"
        : "Sem Authorization",
    });

    const authToken = req.headers.authorization?.split(" ")[1];
    const structureId = (req.headers["x-organization-structure"] as string) || "58";

    if (!authToken) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const {
      sort = "",
      group = "",
      filter = "",
      initialDate,
      finalDate,
      attendant = "",
      name = "",
      phoneNumber = "",
      DDI = "55",
      attendanceStatus = "",
      lastEvent = "",
      isLeafStructure = "True",
      isHotLead = false,
      isPending = false,
      isLeadInvitationAccepted = false,
      isMissedLastSchedule = false,
      isNoContract = false,
    } = req.body;

    if (!initialDate || !finalDate) {
      res.status(400).json({
        error: "Datas não fornecidas",
        required: ["initialDate", "finalDate"],
        example: { initialDate: "01/05/2026", finalDate: "31/05/2026" },
      });
      return;
    }

    const cookies = createCookieString(authToken, structureId);

    const formData = new URLSearchParams({
      sort: sort.toString(),
      group: group.toString(),
      filter: filter.toString(),
      initialDate: initialDate.toString(),
      finalDate: finalDate.toString(),
      attendant: attendant.toString(),
      name: name.toString(),
      phoneNumber: phoneNumber.toString(),
      DDI: DDI.toString(),
      attendanceStatus: attendanceStatus.toString(),
      lastEvent: lastEvent.toString(),
      isLeafStructure: isLeafStructure.toString(),
      isHotLead: isHotLead.toString(),
      isPending: isPending.toString(),
      isLeadInvitationAccepted: isLeadInvitationAccepted.toString(),
      isMissedLastSchedule: isMissedLastSchedule.toString(),
      isNoContract: isNoContract.toString(),
    }).toString();

    console.log("[listFilteredLeads] Enviando requisição:", {
      url: `/Lead360/Main/ListFilteredLeads`,
      initialDate,
      finalDate,
      structureId,
    });

    const response = await apiClient.post(
      `/Lead360/Main/ListFilteredLeads`,
      formData,
      {
        headers: {
          accept: "*/*",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          priority: "u=1, i",
          "sec-ch-ua": '"Not/A)Brand";v="99", "Chromium";v="148"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          cookie: cookies,
        },
      }
    );

    console.log("[listFilteredLeads] Resposta recebida, total de leads:", response.data?.Data?.length ?? 0);

    res.json(response.data);
  } catch (error) {
    console.error("Erro ao listar leads filtrados:", error);
    if (axios.isAxiosError(error)) {
      console.error("Detalhes do erro:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    res.status(500).json({ error: "Erro ao listar leads filtrados" });
  }
};
