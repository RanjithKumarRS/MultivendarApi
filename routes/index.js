import { Router } from "express";
import { authroute } from "./authroute.js";
import { managerroute } from "./managerroute.js";
import { workerroute } from "./workerroute.js";

export const routes=Router()
 
routes.use("/auth",authroute);
routes.use("/manager",managerroute)       
routes.use("/worker",workerroute)       