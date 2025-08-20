// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const app = express();

// ====== Proxy / headers (importante em Render/Vercel) ======
app.set("trust proxy", 1);

// ====== Segurança, logs e JSON ======
app.use(
  helmet({
    // Se você serve PDF/imagens de /uploads e precisar embutir em <img> / <object>, pode precisar ajustar CSP depois
    contentSecurityPolicy: false, // mantém simples por enquanto
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" })); // sobe um pouco o limite p/ payloads maiores

// ====== CORS (libere seus domínios de produção e pré-produção) ======
/**
 * Dicas:
 * - Incluímos padrões para .vercel.app e .onrender.com
 * - Você pode sobrescrever via ENV: CORS_ORIGINS="https://seu-front.vercel.app,https://seu-sub.onrender.com"
 */
const ENV_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const ALLOWLIST = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "https://www.bruthaengenharia.com.br",
  "https://bruthaengenharia.com.br",
  ...ENV_ORIGINS,
];

// padrões (regex) para domínios dinâmicos (preview da Vercel/Render)
const REGEX_ALLOW = [
  /\.vercel\.app$/i,
  /\.onrender\.com$/i,
];

function isAllowedOrigin(origin) {
  if (!origin) return true; // permite ferramentas tipo curl/postman
  if (ALLOWLIST.includes(origin)) return true;
  return REGEX_ALLOW.some(rx => {
    try {
      const host = new URL(origin).hostname;
      return rx.test(host);
    } catch {
      return false;
    }
  });
}

app.use(
  cors({
    origin(origin, cb) {
      if (isAllowedOrigin(origin)) return cb(null, true);
      cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// ====== Banco (Sequelize) ======
const sequelize = require("./backend/config/database");
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco OK");
  } catch (err) {
    console.error("❌ Erro ao conectar no banco:", err?.message || err);
  }
})();

// ====== Rotas ======
const materiaisRoutes = require("./backend/routes/materiais");
const clienteRoutes = require("./backend/routes/clienteRoutes");
const servicoRoutes = require("./backend/routes/servicoRoutes");
const statusRoutes = require("./backend/routes/statusRoutes");
const orcamentoRoutes = require("./backend/routes/orcamentoRoutes");
const entradaRoutes = require("./backend/routes/entradaRoutes");
const saidaRoutes = require("./backend/routes/saidaRoutes");
const reembolsoRoutes = require("./backend/routes/reembolsoRoutes");
const levantamentosRoutes = require("./backend/routes/levantamentoRoutes");
const gerarPropostaRoute = require("./backend/routes/gerarProposta");
const comercialRoutes = require("./backend/routes/comercialRoutes");

// ATENÇÃO: garanta que o nome do arquivo bate com o require (Linux é case-sensitive).
// Se o arquivo chama "InteracaoComercialRoutes.js", use exatamente isso:
const interacoesComercialRoutes = require("./backend/routes/InteracaoComercialRoutes"); // I maiúsculo
const tipoInteracaoRoutes = require("./backend/routes/tipoInteracaoRoutes");
const origemClienteRoutes = require("./backend/routes/origemClienteRoutes");
const interesseComercialRoutes = require("./backend/routes/interesseComercialRoutes");  // i minúsculo

// Mantive **exatamente** seus paths para não quebrar o front, com a correção do nome de variável:
app.use("/api/fornecedores", require("./backend/routes/fornecedores"));
app.use("/api/interesses_comercial", interesseComercialRoutes); // <= corrigido: antes usava 'interesseComercialRoutes' (variável inexistente)
app.use("/api/origens_cliente", origemClienteRoutes);
app.use("/api/tipos_interacao", tipoInteracaoRoutes);
app.use("/api/interacoes_comercial", interacoesComercialRoutes);
app.use("/api/comercial", comercialRoutes);
app.use("/api", gerarPropostaRoute);
app.use("/api/levantamentos", levantamentosRoutes);
app.use("/api/reembolsos", reembolsoRoutes);
app.use("/api/saidas", saidaRoutes);
app.use("/api/entradas", entradaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/servicos_obra", servicoRoutes);
app.use("/status_obra", statusRoutes);
app.use("/api/orcamentos", orcamentoRoutes);
app.use("/materiais", materiaisRoutes);

// uploads estáticos (com cache leve)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "backend", "uploads"), {
    maxAge: "1h",
    etag: true,
    immutable: false,
  })
);

// healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", ts: Date.now() });
});

// fallback simples
app.get("/", (req, res) => {
  res.json({ name: "Brutha API", status: "online" });
});

// ====== Start ======
const PORT = process.env.PORT || 3333;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log("PORTA DEFINIDA PELO SISTEMA:", process.env.PORT);
  console.log(`🚀 Backend rodando em http://${HOST}:${PORT}`);
});

// Encerramento limpo em plataformas com autoscaling
process.on("SIGTERM", () => {
  console.log("SIGTERM recebido. Encerrando servidor...");
  process.exit(0);
});
