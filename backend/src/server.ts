import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

const port = Number(process.env.PORT || 8080);
const app = createApp();

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});
