import { Elysia } from "elysia";
import router from "./routes";


const app = new Elysia({ prefix: '/devstag' })

router(app)

app.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);