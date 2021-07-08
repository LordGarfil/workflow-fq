/* Projects */

import {getProjectDataFromDataBase} from "./projects.js"
import {renderProject} from "../views/projects.js"
import {setRoute, router} from "../../routes/adminRoutes.js"

document.addEventListener("DOMContentLoaded", () => {
  
  document.getElementById("dashboard-item").onclick = (e)=>{
      e.preventDefault()
      setRoute('index.php?dashboard')
  }

  document.getElementById("admin-logout").onclick = (e)=>{
       e.preventDefault()    
      setRoute("index.php?logout")      
  }

});

window.onload = () => {
  router(location.href)
}