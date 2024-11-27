import express, {
  NextFunction,
  ErrorRequestHandler,
  Request,
  Response,
} from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

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
    res.status(500).send("Uh oh! An unexpected error occured. :(");
  }
);

app.listen(PORT, () => {
  console.log(
    `Server is running on port, ${PORT}:\n\t  http://localhost:5000/`
  );
});
