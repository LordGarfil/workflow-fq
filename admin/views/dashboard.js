import { getFormattedDateTime, setFormattedShortDate } from "../../js/app.js"

export const activeProjects_tr = (project) => {
  return `
    <tr>
    <td name="projectNo">${project.id}</td>
    <td>${project.category}</td>
    <td>${project.customer}</td>
    <td>${setFormattedShortDate(project.beginDate)}</td>
  </tr>
    `
}

export const delayedProjects_tr = (project) => {
  const fecha1 = moment(project.finishDate)
  const fecha2 = moment(new Date())
  const diasRetraso = fecha2.diff(fecha1, "days")

  return `
    <tr>
    <td name="projectNo">${project.id}</td>
    <td>${project.customer}</td>
    <td>${setFormattedShortDate(project.finishDate)}</td>
    <td>${diasRetraso} días</td>
  </tr>
    `
}

export const activeProjects_empty = () => {
  return `
    <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 235px;
    ">
  <span style="">Aún no hay proyectos activos</span>
  <a class="btn btn-primary" href="index.php?scheduledProjects">Ver agendados</a>

    </div>
  
    `
}

export const delayedProjects_empty = () => {
  return `
  <div style="
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  height: 235px;
">

<div class="activities_empty" style="
  align-items: center;
  text-align: center;
">
<span style="">¡<strong>Felicidades</strong>, no tienes proyectos retrasados!</span>
</div>

<div class="activities_empty" style="flex-direction: row">
<img style="
width: 100px;
" src="../static/img/congratulations.svg" alt="">
</div>

</div>
  
    `
}
