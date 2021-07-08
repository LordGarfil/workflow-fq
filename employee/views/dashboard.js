import { setFormattedShortDate } from "../../js/app.js"

export const activeProductsProject_tr = (product) => {
  return `
    <tr>
    <td name="projectNo">
    <span hidden>${product.id}</span>
    ${product.proyecto}
    </td>
    <td>${product.producto}</td>
    <td>${product.etapa}</td>
    <td>${setFormattedShortDate(product.fecha_inicio)}</td>
  </tr>
    `
}

export const delayedProductsProject_tr = (product) => {
  const fecha1 = moment(product.fecha_finalizacion)
  const fecha2 = moment(new Date())
  const diasRetraso = fecha2.diff(fecha1, "days")

  return `
    <tr>
    <td name="projectNo">
    <span hidden>${product.id}</span>
    ${product.proyecto}
    </td>
    <td>${product.producto}</td>
    <td>${setFormattedShortDate(product.fecha_finalizacion)}</td>
    <td>${diasRetraso} días</td>
  </tr>
    `
}

export const activeProductsProject_empty = () => {
  return `
    <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 235px;
    ">
  <span style="">Aún no hay proyectos activos</span>
  <a class="btn btn-primary" href="./index.php?scheduledProjects">Ver agendados</a>

    </div>
  
    `
}

export const delayedProductsProject_empty = () => {
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
