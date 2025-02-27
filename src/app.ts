import express, {
  type NextFunction,
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import routes from "@/routes/routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the EmployeesApi!");
});

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);
    res.status(500).send("Uh oh! An unexpected error occurred. :(");
  }
);

app.use("/", routes);

export default app;
