import express, { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Nome de usuário para login
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senha123
 *               provider:
 *                 type: string
 *                 enum: [elos, evup, botosense]
 *                 default: elos
 *                 description: Provider a ser utilizado
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: Token de autenticação
 *                 provider:
 *                   type: string
 *                   description: Nome do provider utilizado
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login);

export default router;
