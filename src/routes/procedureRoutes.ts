import { Router } from "express";
import * as procedureController from "../controllers/procedureController";

const router = Router();

/**
 * @swagger
 * /api/procedures/types:
 *   get:
 *     summary: Busca tipos de procedimento
 *     tags: [Procedimentos]
 *     responses:
 *       200:
 *         description: Lista de tipos de procedimento
 */
router.get("/types", procedureController.getProcedureTypes);

/**
 * @swagger
 * /api/procedures/list:
 *   get:
 *     summary: Lista todos os procedimentos
 *     tags: [Procedimentos]
 *     responses:
 *       200:
 *         description: Lista de todos os procedimentos
 */
router.get("/list", procedureController.getAllProcedures);

/**
 * @swagger
 * /api/procedures/available:
 *   post:
 *     summary: Busca procedimentos disponíveis
 *     tags: [Procedimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Client_Id
 *               - ItemClassifier_Id
 *               - InitDate
 *               - EndDate
 *               - InitTime
 *               - EndTime
 *             properties:
 *               Client_Id:
 *                 type: integer
 *                 description: ID do cliente
 *               ItemClassifier_Id:
 *                 type: integer
 *                 description: ID do classificador do item
 *               InitDate:
 *                 type: string
 *                 description: Data inicial
 *               EndDate:
 *                 type: string
 *                 description: Data final
 *               InitTime:
 *                 type: string
 *                 description: Hora inicial
 *               EndTime:
 *                 type: string
 *                 description: Hora final
 *               AllowDocking:
 *                 type: boolean
 *                 default: false
 *                 description: Permitir encaixe
 *               Locality_Id:
 *                 type: integer
 *                 description: ID da localidade
 *               SchedulingBySystem:
 *                 type: boolean
 *                 default: false
 *                 description: Agendamento pelo sistema
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *                 description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Lista de procedimentos disponíveis
 *       400:
 *         description: Parâmetros obrigatórios não fornecidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/available", procedureController.getAvailableProcedures);

/**
 * @swagger
 * /api/procedures/daily:
 *   post:
 *     summary: Busca procedimentos de um dia específico
 *     tags: [Procedimentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data no formato YYYY-MM-DD
 *                 example: 2024-02-21
 *               procedureName:
 *                 type: string
 *                 description: Nome do procedimento para filtrar (opcional)
 *               statusName:
 *                 type: string
 *                 description: Nome do status para filtrar (opcional)
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *                 description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Lista de procedimentos do dia
 *       400:
 *         description: Data não fornecida ou inválida
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/daily", procedureController.getDailyProcedures);

export default router;
