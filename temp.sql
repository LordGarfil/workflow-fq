BEGIN declare status int;
set
  status:= (
    SELECT
      fk_estado_asignacion as asignmentStatus
    from
      productos_proyectos
    where
      fk_proyecto = project
  );
IF status = 1 THEN
SELECT
  productos_proyectos.id,
  proyectos.id as project,
  productos.descripcion as name,
  productos.id as productId,
  productos_proyectos.cantidad as quantity,
  productos_proyectos.instrucciones as instructions,
  productos_instalable.instalable as installable,
  productos_proyectos.direccion as address,
  estados_asignacion.id AS asignationStatus,
  usuarios.nombre as responsible,
  estados_proyecto.estado as status
from
  productos_proyectos,
  proyectos,
  usuarios,
  productos,
  productos_instalable,
  estados_proyecto,
  estados_asignacion
where
  productos.id = fk_producto
  and proyectos.id = fk_proyecto
  and productos_instalable.id = productos_proyectos.instalable
  AND estados_proyecto.id = fk_estado
  and estados_asignacion.id = fk_estado_asignacion
  and usuarios.id = productos_proyectos.fk_responsable
  and productos_proyectos.fk_proyecto = project
order by
  productos_proyectos.id;
END IF;
IF status = 2 THEN
SELECT
  productos_proyectos.id,
  proyectos.id as project,
  productos.descripcion as name,
  productos.id as productId,
  productos_proyectos.cantidad as quantity,
  productos_proyectos.instrucciones as instructions,
  productos_instalable.instalable as installable,
  productos_proyectos.direccion as address,
  estados_asignacion.id AS asignationStatus,
  'Sin asignar' as responsible,
  estados_proyecto.estado as status
from
  productos_proyectos,
  proyectos,
  productos,
  productos_instalable,
  estados_proyecto,
  estados_asignacion
where
  productos.id = fk_producto
  and proyectos.id = fk_proyecto
  and productos_instalable.id = productos_proyectos.instalable
  AND estados_proyecto.id = fk_estado
  and estados_asignacion.id = fk_estado_asignacion
  and productos_proyectos.fk_proyecto = project
order by
  productos_proyectos.id;
END IF;
END