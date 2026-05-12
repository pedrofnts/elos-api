import { Router } from "express";
import * as leadController from "../controllers/leadController";

const router = Router();

/**
 * @swagger
 * /api/leads/list-filtered:
 *   post:
 *     summary: Lista leads filtrados por data de criação
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-organization-structure
 *         schema:
 *           type: string
 *           default: "58"
 *         description: ID da estrutura organizacional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - initialDate
 *               - finalDate
 *             properties:
 *               initialDate:
 *                 type: string
 *                 description: Data inicial no formato DD/MM/YYYY
 *                 example: "01/05/2026"
 *               finalDate:
 *                 type: string
 *                 description: Data final no formato DD/MM/YYYY
 *                 example: "31/05/2026"
 *               attendant:
 *                 type: string
 *                 description: ID do atendente
 *                 default: ""
 *               name:
 *                 type: string
 *                 description: Nome do lead
 *                 default: ""
 *               phoneNumber:
 *                 type: string
 *                 description: Número de telefone
 *                 default: ""
 *               DDI:
 *                 type: string
 *                 description: DDI do telefone
 *                 default: "55"
 *               attendanceStatus:
 *                 type: string
 *                 description: Status de atendimento
 *                 default: ""
 *               lastEvent:
 *                 type: string
 *                 description: Último evento
 *                 default: ""
 *               isLeafStructure:
 *                 type: string
 *                 default: "True"
 *               isHotLead:
 *                 type: boolean
 *                 default: false
 *               isPending:
 *                 type: boolean
 *                 default: false
 *               isLeadInvitationAccepted:
 *                 type: boolean
 *                 default: false
 *               isMissedLastSchedule:
 *                 type: boolean
 *                 default: false
 *               isNoContract:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Lista de leads filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Id:
 *                         type: integer
 *                       Name:
 *                         type: string
 *                       ClientId:
 *                         type: integer
 *                       CreationDate:
 *                         type: string
 *                         format: date-time
 *                       Status:
 *                         type: integer
 *                       AttendanceStatus:
 *                         type: integer
 *                       AttendanceStatusDescription:
 *                         type: string
 *                       StatusDescription:
 *                         type: string
 *                       MediaName:
 *                         type: string
 *                       AttendantName:
 *                         type: string
 *                       PhoneNumber:
 *                         type: string
 *                       FormattedPhoneNumber:
 *                         type: string
 *                       Converted:
 *                         type: boolean
 *                       IsHotLead:
 *                         type: boolean
 *                       NoContract:
 *                         type: boolean
 *       400:
 *         description: Datas não fornecidas
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/list-filtered", leadController.listFilteredLeads);

export default router;
