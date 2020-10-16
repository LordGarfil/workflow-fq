import { fecthChanges } from "./dashboard.js";
/* Projects */

import {getProjectDataFromDataBase} from "./projects.js"
import {renderProject} from "../views/projects.js"
import {router, router2, setRoute} from "../../routes/routes.js"

document.addEventListener("DOMContentLoaded", () => {
    // setRoute('dashboard')
    renderView("./views/dashboard.html", fecthChanges())

  document.getElementById("projects-item").onclick = async(e) => {
    e.preventDefault();
    // setRoute('index.php?projects')
    setRoute('projects')
  };


  document.getElementById("dashboard-item").onclick = (e)=>{
      e.preventDefault()
      // setRoute('index.php?dashboard')
      setRoute('dashboard')
  }

  document.getElementById("admin-logout").onclick = (e)=>{
       e.preventDefault()
      setRoute("logout")      
      // setRoute("index.php?logout")      
  }
});

export const renderView = async (view, renderContent) => {
  const res = await fetch(view);
  const data = await res.text();

  document.querySelector(".container-fluid").innerHTML = "";
  const div = document.createElement("div");
  // div.setAttribute('id', 'projects-div')
  div.innerHTML = data
  document.querySelector(".container-fluid").append(div);
  if(renderContent){
      renderContent()
  }
};  

export const redirectFile = (file) =>{
  window.location.href = file
}

