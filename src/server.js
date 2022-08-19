const express = require("express")
const cors = require("cors");
const helmet = require("helmet")
const morgan = require('morgan')
const compression = require("compression");
const app = express()

const routes = require('./modules/route')
const createError = require('./helpers/createError')
const {HTTP} = require('./constants/http')
const { RESPONSE} = require('./constants/response')

app.disable("x-powered-by");

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(compression());
app.use(morgan("dev"));
app.use(cors());

app.use(function(_err, _req, _res, _){
  if(_err instanceof SyntaxError){
    return _res.status(400).json({
      code: 422,
      status: "error",
      message: 'Invalid json payload passed',
      data: null
    })
  }
})
 
const apiRouter = express.Router()
apiRouter.use(routes())
const baseUrl = '/flw-pay'
app.use(baseUrl, apiRouter)


apiRouter.use((_req, _res, next) => {
  next(
    createError(HTTP.NOT_FOUND, [
      {
        code: HTTP.NOT_FOUND,
        status: RESPONSE.ERROR,
        message: "Route not found.",
        data: null,
      },
    ])
  );
});




// error handler for api router
apiRouter.use((error, _req, res, _next) => {
  console.log(error);
  const initialError = error
  if(!error.statusCode){
    error = createError(HTTP.SERVER_ERROR, [
      {
        code: HTTP.SERVER_ERROR,
        status: RESPONSE.ERROR,
        message: initialError.message || "Internal Server Error",
        data: error.data,
        stack: error.stack
      }
    ])
  }

  return res.status(error.statusCode).json({
    code: error.statusCode,
    status: error.status,
    message: error.message,
    data: error.data || null,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});



module.exports = app