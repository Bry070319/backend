import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const whitelist = [
  "https://sistema-gestion-proyecto.vercel.app",
  "http://localhost:3000"
];
const vercelRegex = /^https?:\/\/[a-z0-9-]+\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (whitelist.includes(origin) || vercelRegex.test(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

server.use(cors(corsOptions));
server.use(jsonServer.bodyParser);

// (opcional) normalizar ids a número
const toNumber = v => (v === null || v === undefined || v === "" ? v : Number(v));
server.use((req, _res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body && typeof req.body === "object") {
    ["id","userId","ownerId","assigneeId","projectId"].forEach(k => {
      if (k in req.body) req.body[k] = toNumber(req.body[k]);
    });
  }
  next();
});

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server running on port ${PORT}`);
});
