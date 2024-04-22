import { Elysia } from "elysia";
import router from "./routes";
import { jwt } from '@elysiajs/jwt'
import { ErrorHandler } from "../errors/ErrorHandler"

const app = new Elysia({ prefix: '/devstag/v1' })

app.use(
  jwt({
      name: 'accessTokenjwt',
      secret: Bun.env.JWT_ACCESS_TOKEN_SECRET,
      exp: '1h'
  })
)
app.use( 
  jwt({
    name: 'refreshTokenjwt',
    secret: Bun.env.JWT_REFRESH_TOKEN_SECRET,
    exp: '7d'
}))

app.use( 
  jwt({
    name: 'sessionTokenjwt',
    secret: Bun.env.JWT_SESSION_TOKEN_SECRET,
    exp: '7d'
}))

router(app)

app.error({CUSTOM_ERROR : ErrorHandler})
app.onError(({error, set}) => {
  console.log("sending Error data From index:",error)
  if(error instanceof ErrorHandler){
    set.status = error.statusCode
    const errData = {
      statusCode: error.statusCode,
      errorCode: error.customErrCode,
      message: error.message
    }
    return errData
  }
  set.status = 500
    const errData = {
      statusCode: 500,
      message: "Internel Server Error from BUN.js, Contect Geticke",
    }
    return errData
})

app.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);