const express = require("express");

const vs = "/api/v1";
const path = "./managers/http/routes";
const {globalErrors, notFound} = require("./managers/api/middlewares/ErrorHandler");

const adminRouter = require(path+"/staff/adminRouter"); 
const studentRouter = require(path+"/staff/student");
const teachersRouter = require(path+"/staff/teachers");

const academicTermRouter = require(path+"/academics/academicTerm");
const academicYearRouter = require(path+"/academics/academicYear");
const classLevelRouter = require(path+"/academics/classLevel");
const programRouter = require(path+"/academics/program");
const subjectRouter = require(path+"/academics/subjects");
const yearGroupRouter = require(path+"/academics/yearGroups");

const app = express();
app.use(express.json());

//Routes
app.use(vs+"/admins", adminRouter);
app.use(vs+"/teachers", teachersRouter);
app.use(vs+"/students", studentRouter);

app.use(vs+"/academic-terms", academicTermRouter);
app.use(vs+"/academic-years", academicYearRouter);
app.use(vs+"/class-levels", classLevelRouter);
app.use(vs+"/programs", programRouter);
app.use(vs+"/subjects", subjectRouter);
app.use(vs+"/year-groups", yearGroupRouter);

//Error middlewares
app.use(notFound);
app.use(globalErrors);

module.exports = app;


// const config                = require('./config/index.config.js');
// const Cortex                = require('ion-cortex');
// const ManagersLoader        = require('./loaders/ManagersLoader.js');

// const mongoDB = config.dotEnv.MONGO_URI? require('./connect/mongo')({
//     uri: config.dotEnv.MONGO_URI
// }):null;

// const cache = require('./cache/cache.dbh')({
//     prefix: config.dotEnv.CACHE_PREFIX ,
//     url: config.dotEnv.CACHE_REDIS
// });

// const cortex = new Cortex({
//     prefix: config.dotEnv.CORTEX_PREFIX,
//     url: config.dotEnv.CORTEX_REDIS,
//     type: config.dotEnv.CORTEX_TYPE,
//     state: ()=>{
//         return {} 
//     },
//     activeDelay: "50ms",
//     idlDelay: "200ms",
// });

// const managersLoader = new ManagersLoader({config, cache, cortex});
// const managers = managersLoader.load();
// managers.userServer.run();