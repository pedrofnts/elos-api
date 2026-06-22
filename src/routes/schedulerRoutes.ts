import { Router } from "express";
import * as schedulerController from "../controllers/schedulerController";

const router = Router();

/**
 * @swagger
 * /api/scheduler/read:
 *   post:
 *     summary: Busca agendamentos
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start
 *               - end
 *             properties:
 *               start:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora inicial
 *                 example: 2024-01-01T00:00:00.000Z
 *               end:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora final
 *                 example: 2024-01-31T23:59:59.999Z
 *               sort:
 *                 type: string
 *                 description: Ordenação
 *                 default: ""
 *               page:
 *                 type: integer
 *                 description: Número da página
 *                 default: 1
 *               pageSize:
 *                 type: integer
 *                 description: Tamanho da página
 *                 default: 100
 *               group:
 *                 type: string
 *                 description: Agrupamento
 *                 default: ""
 *               filter:
 *                 type: string
 *                 description: Filtro
 *                 default: ""
 *               establishment:
 *                 type: string
 *                 description: Estabelecimento
 *                 default: ""
 *               locality:
 *                 type: string
 *                 description: Localidade
 *                 default: ""
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *                 description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/read", schedulerController.getSchedules);

/**
 * @swagger
 * /api/scheduler/availability-periods:
 *   post:
 *     summary: Busca horários disponíveis
 *     tags: [Agendamentos]
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
 *             properties:
 *               Client_Id:
 *                 type: integer
 *                 description: ID do cliente
 *               ItemClassifier_Id:
 *                 type: integer
 *                 description: ID do classificador do item
 *               SelectedSessions:
 *                 type: string
 *                 description: Sessões selecionadas
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
 *                 description: Permitir encaixe
 *               Locality_Id:
 *                 type: integer
 *                 description: ID da localidade
 *               OrganizationStructureSelected_Id:
 *                 type: integer
 *                 description: ID da estrutura organizacional
 *               NumberOfNearbyEstablishments:
 *                 type: integer
 *                 description: Número de estabelecimentos próximos
 *               Rescheduler_Id:
 *                 type: integer
 *                 description: ID do reagendamento
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *     responses:
 *       200:
 *         description: Períodos disponíveis
 *       400:
 *         description: Parâmetros obrigatórios não fornecidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post(
  "/availability-periods",
  schedulerController.getAvailabilityPeriods
);

/**
 * @swagger
 * /api/scheduler/submit-availability:
 *   post:
 *     summary: Submete um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - model
 *               - selected
 *             properties:
 *               model:
 *                 type: object
 *                 required:
 *                   - Client_Id
 *                   - ItemClassifier_Id
 *                 properties:
 *                   Client_Id:
 *                     type: integer
 *                   ItemClassifier_Id:
 *                     type: integer
 *                   SelectedSessions:
 *                     type: string
 *                   Rescheduler_Id:
 *                     type: integer
 *                   ChangeAllEventLink:
 *                     type: boolean
 *                   IgnoreParallelValidation:
 *                     type: boolean
 *               selected:
 *                 type: object
 *                 required:
 *                   - InitDate
 *                   - EndDate
 *                   - Locality_Id
 *                   - OwnerOrgStruct_Id
 *                 properties:
 *                   InitDate:
 *                     type: string
 *                   EndDate:
 *                     type: string
 *                   Locality_Id:
 *                     type: integer
 *                   OwnerOrgStruct_Id:
 *                     type: integer
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Parâmetros não fornecidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/submit-availability", schedulerController.submitAvailability);

/**
 * @swagger
 * /api/scheduler/update-status:
 *   post:
 *     summary: Atualiza status de um agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do agendamento
 *               status:
 *                 type: integer
 *                 description: Novo status
 *               ignoreReleaseValidation:
 *                 type: boolean
 *                 description: Ignorar validação de liberação
 *               observations:
 *                 type: string
 *                 description: Observações
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Parâmetros não fornecidos
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/update-status", schedulerController.updateStatus);

/**
 * @swagger
 * /api/scheduler/upcoming:
 *   get:
 *     summary: Busca agendamentos dos próximos 6 meses
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *           enum: [elos, evup, botosense]
 *           default: elos
 *         description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Lista de agendamentos futuros
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/upcoming", schedulerController.getUpcomingSchedules);

/**
 * @swagger
 * /api/scheduler/{id}:
 *   get:
 *     summary: Busca detalhes de um agendamento por ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *           enum: [elos, evup, botosense]
 *           default: elos
 *         description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: ID não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Agendamento não encontrado
 */
router.get("/:id", schedulerController.getScheduleById);

/**
 * @swagger
 * /api/scheduler/{id}/history:
 *   post:
 *     summary: Busca histórico de mudanças de um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 default: 1
 *               pageSize:
 *                 type: integer
 *                 default: 100
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *     responses:
 *       200:
 *         description: Histórico do agendamento com CreateDate, StatusDescription e CreateUser_Name por entrada
 *       400:
 *         description: ID não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/:id/history", schedulerController.getScheduleHistory);

export default router;
