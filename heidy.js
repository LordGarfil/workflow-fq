function htmlOptionEstoma(option_estoma){
    // let {estoma_id, nombre} = option_estoma
    const finca_id = 1
    const nuevo = option_estoma.filter((element) => element.id == finca_id)
    return nuevo
}

console.log(
    htmlOptionEstoma(
        [
            {id: 1, nombre: 'estoma1'},
            {id: 2, nombre: 'estoma2'},
            {id: 1, nombre: 'estoma3'}
        ]
    )
);