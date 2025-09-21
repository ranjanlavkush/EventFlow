import express, { type Request, Response, NextFunction } from "express";
import http from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Initialize the app
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return;

  // Setup routes
  await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  isInitialized = true;
}

// Vercel (serverless) vs local
if (process.env.VERCEL) {
  (async () => {
    await initializeApp();
    // Always serve built frontend on Vercel
    serveStatic(app);
  })();
} else {
  (async () => {
    await initializeApp();

    const server = http.createServer(app);

    if (process.env.NODE_ENV === "development") {
      // Use Vite dev server middleware
      await setupVite(app, server);
    } else {
      // Serve static frontend in production
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running at http://localhost:${port}`);
      log(`📱 Also accessible at http://[YOUR_IP]:${port}`);
    });
  })();
}

export default app;


// Export the app for Vercel (must be at top level)