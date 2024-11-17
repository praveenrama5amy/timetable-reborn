import express from "express"
import cors from "cors"
import dotenv from "dotenv"



const { parsed: env, error: envError } = dotenv.config()
if (envError) throw envError;



const app = express()
app.listen(env?.HTTP_PORT || 3000, () => {
    console.log(`Server listening on PORT ${env?.HTTP_PORT || 3000}`);
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



//Routers 
import indexRouter from "./routes/index"
app.use("/", indexRouter)
import departmentRouter from "./routes/department"
app.use("/department",departmentRouter)

