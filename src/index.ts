import { container } from "./app";
import { startServer } from "./server";

// Get the server from the container
const server = container.resolve("server");

const port = process.env.PORT || 3000;

// Start the server
startServer(server, Number(port));
