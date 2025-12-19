import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat";

const app = express();
app.use(express.json());
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
        message: "Invalid input!",
        error: "Invalid JSON payload"
    });
  }
  next(err);
});
app.use(cors());

app.use("/api", chatRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
})