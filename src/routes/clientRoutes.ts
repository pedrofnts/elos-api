import { Router } from "express";
import * as clientController from "../controllers/clientController";

const router = Router();

/**
 * @swagger
 * /api/clients/search:
 *   get:
 *     summary: Busca clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Tamanho da página
 *       - in: query
 *         name: pageNum
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *     responses:
 *       200:
 *         description: Lista de clientes encontrados
 *       400:
 *         description: Termo de busca não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.get("/search", clientController.searchClients);

/**
 * @swagger
 * /api/clients/list-filtered:
 *   post:
 *     summary: Lista clientes com filtros
 *     tags: [Clientes]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sort:
 *                 type: string
 *                 default: ""
 *               page:
 *                 type: integer
 *                 default: 1
 *               pageSize:
 *                 type: integer
 *                 default: 10
 *               group:
 *                 type: string
 *                 default: ""
 *               filter:
 *                 type: string
 *                 default: ""
 *               document:
 *                 type: string
 *                 description: CPF/CNPJ
 *                 default: ""
 *               name:
 *                 type: string
 *                 description: Nome do cliente
 *                 default: ""
 *               phone:
 *                 type: string
 *                 description: Telefone
 *                 default: ""
 *               initialDate:
 *                 type: string
 *                 description: Data inicial
 *                 default: ""
 *               finalDate:
 *                 type: string
 *                 description: Data final
 *                 default: ""
 *               media:
 *                 type: string
 *                 description: Mídia
 *                 default: ""
 *               type:
 *                 type: string
 *                 description: Tipo
 *                 default: ""
 *               email:
 *                 type: string
 *                 description: E-mail
 *                 default: ""
 *     responses:
 *       200:
 *         description: Lista de clientes filtrados
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/list-filtered", clientController.listFilteredClients);

/**
 * @swagger
 * /api/clients/birthdays:
 *   post:
 *     summary: Busca aniversariantes de uma data específica
 *     tags: [Clientes]
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
 *                 description: Data para buscar aniversariantes
 *                 example: 2024-02-21
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *                 description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Lista de aniversariantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 date:
 *                   type: string
 *                 structureId:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 aniversariantes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                       dataAniversario:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telefone:
 *                         type: string
 *                       endereco:
 *                         type: object
 *                       cpfCnpj:
 *                         type: string
 *                       permissoes:
 *                         type: object
 *                       inativo:
 *                         type: boolean
 *       400:
 *         description: Data não fornecida
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/birthdays", clientController.getBirthdaysByDate);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Busca todos os clientes de uma unidade
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de todos os clientes
 */
router.get("/", clientController.getAllClientsByUnit);

/**
 * @swagger
 * /api/clients/history:
 *   post:
 *     summary: Busca histórico de sessões executadas do cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *             properties:
 *               clientId:
 *                 type: integer
 *                 description: ID do cliente
 *               pageSize:
 *                 type: integer
 *                 default: 10
 *                 description: Tamanho da página
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Número da página
 *               sort:
 *                 type: string
 *                 default: ""
 *                 description: Ordenação
 *               group:
 *                 type: string
 *                 default: Item_Description-asc
 *                 description: Agrupamento
 *               filter:
 *                 type: string
 *                 default: ""
 *                 description: Filtro
 *     responses:
 *       200:
 *         description: Histórico de sessões do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 clientId:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 conversionAnalysis:
 *                   type: object
 *                 sessions:
 *                   type: object
 *       400:
 *         description: ID do cliente não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post("/history", clientController.getClientHistory);

export default router;
