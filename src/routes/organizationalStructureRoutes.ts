import { Router } from "express";
import * as organizationalStructureController from "../controllers/organizationalStructureController";

const router = Router();

/**
 * @swagger
 * /api/organizational-structures:
 *   post:
 *     summary: Lista estruturas organizacionais (unidades) do usuário
 *     tags: [Estrutura Organizacional]
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
 *               group:
 *                 type: string
 *                 default: ""
 *               filter:
 *                 type: string
 *                 default: ""
 *     responses:
 *       200:
 *         description: Lista de estruturas organizacionais do usuário
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post(
  "/",
  organizationalStructureController.listOrganizationalStructures
);

/**
 * @swagger
 * /api/organizational-structures/set-current:
 *   post:
 *     summary: Define a estrutura organizacional atual
 *     tags: [Estrutura Organizacional]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - structureId
 *             properties:
 *               structureId:
 *                 type: string
 *                 description: ID da estrutura organizacional
 *     responses:
 *       200:
 *         description: Estrutura organizacional definida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 structureId:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: ID da estrutura não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post(
  "/set-current",
  organizationalStructureController.setCurrentOrganizationalStructure
);

export default router;
