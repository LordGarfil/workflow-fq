import { project } from "./projects.js";
import {setRoute, router} from "../../routes/employeeRoutes.js"

const clsProject = new project();

// let interval = setInterval(() => {
//   clsProject.fetchPendingProjects();
// }, 10000);

document.addEventListener("DOMContentLoaded", () => {

  // clsProject.fetchPendingProjects();

  document.getElementById("admin-logout").onclick = (e)=>{
    e.preventDefault()    
    setRoute("index.php?logout")      
}

})

window.onload = () => {
  router(location.href)
}