import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"



const { parsed: env, error: envError } = dotenv.config()
if (envError) throw envError;

const app = express()
app.listen(env?.HTTP_PORT || 3000, () => {

    console.log(`Server listening on PORT ${env?.HTTP_PORT || 3000}`);
})

app.use(cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: "http://192.168.0.123:5173",
    allowedHeaders: "Access-Control-Allow-Origin, Authorization, content-type",
    preflightContinue: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//Routers 
import indexRouter from "./routes/index"
app.use("/", indexRouter)
import departmentRouter from "./routes/department"
app.use("/department", departmentRouter)
import classRouter from "./routes/class"
app.use("/class", classRouter)
import facultyRouter from "./routes/faculty"
app.use("/faculty", facultyRouter)
import subjectRouter from "./routes/subject"
app.use("/subject", subjectRouter)
import conflictRouter from "./routes/conflict"
app.use("/conflict", conflictRouter)
import timetableRouter from "./routes/timetable"
app.use("/timetable", timetableRouter)
import userRouter from "./routes/user"
app.use("/user", userRouter)