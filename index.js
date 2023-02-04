require("dotenv").config();
require("express-async-errors");

//cron jobs
// require('./crons/billGeneration')

//express
const express = require("express");
const app = express();

//middleware
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const fileUpload = require("express-fileupload");
const logger = require("./middleware/logger");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
app.use(express.json());
app.use(fileUpload());
app.use(logger);
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(xss());

//routers
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const chatRouter = require("./routes/chat");

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/chats", chatRouter);
// app.use("/api/v1/orders", orderRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// start server
const connectDB = require("./configs/dbConfig");
const port = process.env.PORT || 5555;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
