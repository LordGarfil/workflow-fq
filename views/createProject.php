<div class="create-project-content">
  <div class="card p-4">
    <div class="create-project-header mb-2">
      <h3>Crear Proyecto</h3>
      <div id="succesProjectCreation" class="alert alert-success" role="alert" style="width: 15em; display: none;">
  ¡Proyecto creado con éxito!
</div>
    </div>

    <form class="fit-inputs-form" action="../backend/createProject.php" id="dataProjectForm">
      <div class="creation-project-header">

        <div class="project-info-1">

          <div class="d-flex flex-wrap mb-2 ">
            <span class="">Cliente</span>
            <div>

              <!-- <input id="projectCustomer_input" class="inputSelect form-control" style="width: 70% !important;"> -->

              <select class="editableBox form-control" id="projectCustomer_select" style="display: inline !important;  font-size: 0.85em !important;">
                <option value="none" selected disabled hidden>
                </option>
                <?php
                require_once("../backend/dbConection.php");
                $sql = "SELECT * FROM personas";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result as $row) {
                  print('<option value=' . $row["numero_documento"] . '>' . $row['nombres'] . " " . $row['apellidos'] . '</option>');
                }
                ?>
              </select>

            </div>

            <h6 class="newClient-project"><i class="fas fa-user-plus"></i></h6>
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Inicio</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectBeginDate" />
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Categoria</span>
            <select name="" id="projectCategory" class="form-control">
              <option value="none" selected disabled hidden>
              <option value="1">Fotografia</option>
              <option value="2">Publicidad</option>
            </select>
          </div>

        </div>

        <div class="project-info-2">


          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Fecha Fin</span>
            <input placeholder="Fecha Inicio" class="form-control type-date" type="datetime-local" id="projectFinishDate" disabled/>
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Valor</span>
            <input id="projectValue" type="number" min="0" class="form-control" onkeypress="return isNumberKey(event)">
          </div>

          <div class="d-flex flex-wrap mb-2 align-items-center">
            <span>Total Pagado</span>
            <input id="projectValuePaid" type="number" min="0" class="form-control" onkeypress="return isNumberKey(event)">
          </div>

        </div>

      </div>

      <div class="project-info-3">
        <div class="d-flex flex-wrap mb-2 align-items-center">
          <span>Observaciones</span>
          <textarea id="projectObservations" cols="1" rows="4" class="form-control" maxlength="150" style="max-height: 80px;"></textarea>
        </div>
      </div>

      <hr>
    </form>
    <div class="d-flex" style="justify-content: flex-end;">
      <button id="btnAddNewProjectProduct" class="btn btn-primary position-sticky">Agregar Producto</button>
    </div>
    <form class="overflow-auto">
      <table class="workflow-table project-creation-table" id="project-creation-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Instalable</th>
            <th scope="col">Dirección</th>
            <th scope="col">Instrucciones</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="project-admin-table-body">
          <tr class="project-creation-table">
            <th>1</th>
            <td style="width: 20em;">
              <select name="" id="" class="form-control select-table-input" style="width: 18em !important;">
              <option value="none" selected disabled hidden>
                </option>
              <?php
                require_once("../backend/dbConection.php");
                $sql = "SELECT * FROM productos";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result as $row) {
                  print('<option value=' . $row["id"] . '>' . $row['descripcion'] . '</option>');
                }
                ?>
              </select>
            </td>
            <td style="width: 7em;">
              <input type="number" class="form-control" style="font-size: 0.8rem !important;" min="0" onkeypress="return isNumberKey(event)">
            </td>
            <td style="width: 5em;">
              <select name="" id="" class="form-control select-address" style="width: 7em !important; font-size: 0.8rem; ">
                <option value="2">No</option>
                <option value="1">Si</option>
              </select>
            </td>
            <td>
              <input type="text" class="form-control" style="font-size: 0.8rem;">
            </td>
            <td>
              <textarea id="projectObservations" cols="4" rows="1" class="form-control" maxlength="150" style="max-height: 80px;"></textarea>
            </td>
            <td class="text-center">
              <span><i class="fas fa-trash"></i></i></span>
            </td>
            
          </tr>
      </table>
    </form>
  </div>
</div>
<button type="submit" class="btn btn-primary form-control mt-4 mb-4" id="btnCreateProject" onclick="createProject()">Crear</button>