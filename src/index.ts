// MUST be first import - load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express, { Request } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
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
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limit por provider (100 req/min por provider+IP)
const providerRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req: Request) => {
    const provider = req.body?.provider || (req.query?.provider as string) || 'elos';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `${provider}:${ip}`;
  },
  handler: (req: Request, res) => {
    const provider = req.body?.provider || (req.query?.provider as string) || 'elos';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    console.warn(`[RATE LIMIT] Provider: ${provider} | IP: ${ip} | ${req.method} ${req.path}`);
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit excedido para o provider "${provider}". Tente novamente em 1 minuto.`,
    });
  },
});

app.use('/api', providerRateLimit);

// Middleware para logar todas as requisições
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | IP: ${ip}`);
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
