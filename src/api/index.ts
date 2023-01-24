import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { employeesRouter } from "./routes";
import * as config from './config';

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'default-src': [ "'self'" ],
        'base-uri': [ "'self'" ],
        'block-all-mixed-content': [],
        'font-src': [ "'self'", 'https:', 'data:' ],
        'frame-ancestors': [ "'self'" ],
        'img-src': [ "'self'", 'data:' ],
        'object-src': [ "'none'" ],
        'script-src': [ "'self'" ],
        'script-src-attr': [ "'none'" ],
        'style-src': [ "'self'", 'https:', "'unsafe-inline'" ]
      },
    })
  );

// very basic CORS setup
app.use(cors({
  origin: config.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use("/api/employees", employeesRouter);

app.listen(config.API_PORT, () => {
  console.log(`API listenting on port ${config.API_PORT}`);
});
