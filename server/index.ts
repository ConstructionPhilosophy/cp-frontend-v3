import { createServer } from "vite";
import path from "path";

async function startServer() {
  const server = await createServer({
    root: path.resolve("."),
    server: {
      port: 5000,
      host: "0.0.0.0"
    },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@assets": path.resolve("./attached_assets"),
      },
    },
  });

  await server.listen();
  console.log("Vite dev server running on port 5000");
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});