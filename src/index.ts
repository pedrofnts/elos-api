// MUST be first import - load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import schedulerRoutes from "./routes/schedulerRoutes";
import clientRoutes from "./routes/clientRoutes";
import procedureRoutes from "./routes/procedureRoutes";
import organizationalStructureRoutes from "./routes/organizationalStructureRoutes";
import authRoutes from "./routes/authRoutes";
import { getCurrentProvider } from './config/providers';
import { swaggerSpec } from './config/swagger';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para logar todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/procedures", procedureRoutes);
app.use("/api/organizational-structures", organizationalStructureRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o status da API
 *     tags: [Sistema]
 *     security: []
 *     responses:
 *       200:
 *         description: API está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 provider:
 *                   type: string
 *                 baseUrl:
 *                   type: string
 */
app.get("/health", (req, res) => {
  const provider = getCurrentProvider();
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    provider: provider.name,
    baseUrl: provider.baseUrl,
  });
});

app.listen(port, () => {
  const provider = getCurrentProvider();
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Provider ativo: ${provider.name} (${provider.baseUrl})`);
  console.log("API Grove inicializada com sucesso!");
});
