import { Elysia } from "elysia";
import router from "./routes";
import { jwt } from '@elysiajs/jwt'
import { ErrorHandler } from "../errors/ErrorHandler"
import { cors } from "@elysiajs/cors"
import { lambda } from 'elysia-lambda'


const app = new Elysia({ prefix: '/devstag/v1' })


app.use(lambda())

app.use(
  jwt({
      name: 'accessTokenjwt',
      secret: Bun.env.JWT_ACCESS_TOKEN_SECRET,
      exp: '7d'
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

app.onRequest(({request, set}) => {
  const dataHead = request.headers.toJSON() 

  const allowedDomains = [
    "http://localhost:3000/",
    "https://www.beyondoceans.in/",
    "http://192.168.1.108:3000/",
    "http://localhost:5123/"
  ];
  
  if((!dataHead.referer && (!dataHead.userappdomain || dataHead.userappdomain !== "software")) || (dataHead.referer && !allowedDomains.includes(dataHead.referer))){
    set.status = 401
    return { ststus:"Unauthorized Access", ststusCode:"401" }
  }

    set.headers = {
        "Access-Control-Allow-Origin": Bun.env.ENVR === "PROD" ? "https://www.beyondoceans.in" : Bun.env.SOFT_ENV === "PROD" ? "http://localhost:3000" : "http://localhost:5123",
        "Access-Control-Allow-Headers": "content-type, *, userappdomain",
        "Access-Control-Allow-Credentials": "true",
        "Origin": Bun.env.ENVR === "PROD" ? "https://www.beyondoceans.in" : Bun.env.SOFT_ENV === "PROD" ? "http://localhost:3000" : "http://localhost:5123",
    }
}
)

app.options("/*", ({set}) => {
  set.status = 200
})


router(app)


app.listen(3300);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);