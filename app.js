document.addEventListener('DOMContentLoaded', function () {
    cargarDatos();
    cargarDatosTabla();
    //localStorage.clear();
});

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    var saber = 0;
    var hacer = 0;
    var semenas = 0;
    const numeroUnidades = parseInt(document.getElementById('unidad').value);


    for (let index = 1; index <= numeroUnidades; index++) {
        saber = saber + parseInt(document.getElementById('saber' + index).value);
        hacer = hacer + parseInt(document.getElementById('hacer' + index).value);
        semenas = semenas + parseInt(document.getElementById('semanas' + index).value);
    }
    console.log("Saber", saber);
    console.log("Hacer", hacer);

    if (saber != 40) {
        alert('El porcentaje de saber debe ser igual a 40%');
        return;
    }
    else if (hacer != 60) {
        alert('El porcentaje de hacer-ser debe ser igual a 60%');
        return;
    }
    guardarDatos(saber, hacer, semenas);
});

function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

async function cargarDatos() {
    const selectMateria = document.getElementById('materia');
    const selectMaestro = document.getElementById('maestro');
    const selectFamilia = document.getElementById('familia');
    const selectDuracion = document.getElementById('duracion');
    const selectCuatrimestre = document.getElementById('cuatrimestre');
    const selectUnidad = document.getElementById('unidad');

    const response = await fetch('data.json');
    const data = await response.json();

    console.log("AQUI ESTAB LOS DAOTS", data);

    const materias = data.UTM['Materias'];
    materias.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia;
        option.textContent = materia;
        selectMateria.appendChild(option);
    });

    const maestros = data.UTM['Maestros'];
    maestros.forEach(maestro => {
        const option = document.createElement('option');
        option.value = maestro;
        option.textContent = maestro;
        selectMaestro.appendChild(option);
    });

    const familias = data.UTM['Familias'];
    familias.forEach(familia => {
        const option = document.createElement('option');
        option.value = familia;
        option.textContent = familia;
        selectFamilia.appendChild(option);
    });

    const duraciones = data.UTM['Horas'];
    duraciones.forEach(duracion => {
        const option = document.createElement('option');
        option.value = duracion;
        option.textContent = duracion;
        selectDuracion.appendChild(option);
    });

    const cuatrimestres = data.UTM['Cursos'];
    cuatrimestres.forEach(cuatrimestre => {
        const option = document.createElement('option');
        option.value = cuatrimestre;
        option.textContent = cuatrimestre;
        selectCuatrimestre.appendChild(option);
    });

    const unidades = data.UTM['Unidades'];
    unidades.forEach(unidad => {
        const option = document.createElement('option');
        option.value = unidad;
        option.textContent = unidad;
        selectUnidad.appendChild(option);
    });
}

function cargarDatosTabla() {
    var errorP = document.getElementById('errorTabla');
    var tabla = document.getElementById('tablaContenido');
    errorP.innerHTML = "";
    tabla.innerHTML = "";

    var data = JSON.parse(localStorage.getItem('datos')) || [];
    console.log("Datos", data);

    if (data.length == 0) {
        console.log("No hay datos", data);
        errorP.innerHTML = "No hay datos para mostrar";
        return;
    }

    data.forEach(data => {
        const fila = document.createElement('tr');
        fila.innerHTML =
            `
            <td>${data.cuatrimestre}</td>
            <td>${data.materia}</td>
            <td>${data.objetivo}</td>
            <td>${data.semanasTotal}</td>
            <td><button class="btn btn-info" onclick="cargarModal('${data.id}')">Ver</button></td>
        `;

        tabla.appendChild(fila);
    });
}

function cargarModal(id) {
    var data = JSON.parse(localStorage.getItem('datos')) || [];
    console.log("Data 999", data);
    dataInfo = data.find(dato => dato.id === parseInt(id));
    console.log("Data info", dataInfo);

    var tablaModal = document.getElementById('tablaModal');
    tablaModal.innerHTML = "";

    var cabeza = document.createElement('thead');
    cabeza.innerHTML = `
        <tr>
            <th colspan="2">ASIGNATURA: ${dataInfo.materia}</th>
            <th>FAMILIA: ${dataInfo.familia}</th>
            <th>CUATRIMESTRE: ${dataInfo.cuatrimestre}</th>
            <th>DURACIÓN: ${dataInfo.duracion} hrs.</th>
            <th colspan="2">PROFESOR: ${dataInfo.maestro}</th> 
        </tr>
        <tr>
            <th colspan="6" class="table-title">
                COMPETENCIA: ${dataInfo.competencia}
            </th>
        </tr>
        <tr>
            <th colspan="6" class="table-title">
                OBJETIVO GENERAL: ${dataInfo.objetivo}
            </th>
        </tr>
        <tr>
            <th>U.A.</th>
            <th>Competencia Específica por UA</th>
            <th>Num. Semanas</th>
            <th>Resultado de Aprendizaje (P)</th>
            <th>SABER (C)</th>
            <th>HACER+SER (D)</th>
        </tr>
    `
    tablaModal.appendChild(cabeza);

    var cuerpo = document.createElement('tbody');

    /*
    UA
: 
"materia incesariao"
competencia
: 
"Aprender a leer"
hacer
: 
"60"
resultado
: 
"Ver doddne ir a vivir en 20 años"
saber
: 
"40"
semanas
: 
"15"
     */

    dataInfo.unidades.forEach(unidad => {
        var filaCuerpo = document.createElement('tr');
        filaCuerpo.innerHTML = `
            <tr>
                <td>${unidad.UA}</td>
                <td class="text-left">${unidad.competencia}</td>
                <td>${unidad.semanas}</td>
                <td>${unidad.resultado}</td>
                <td>${unidad.saber}</td>
                <td>${unidad.hacer}</td>
            </tr>
        `;
        cuerpo.appendChild(filaCuerpo);
    });

    var filaTotal = document.createElement('tr');
    filaTotal.innerHTML = `
        <td colspan="2"><strong>Total</strong></td>
        <td><strong>${dataInfo.semanasTotal}</strong></td>
        <td></td>
        <td><strong>${dataInfo.saberTotal}%</strong></td>
        <td><strong>${dataInfo.hacerTotal}%</strong></td>
    `;
    cuerpo.appendChild(filaTotal);

    tablaModal.appendChild(cuerpo);

    openModal();
}

function generarUnidades() {
    if (document.getElementById('unidad').value == "") {
        document.getElementById('unidades').innerHTML = "";
        return;
    }

    const unidades = document.getElementById('unidades');
    unidades.innerHTML = "";
    const numeroUnidades = parseInt(document.getElementById('unidad').value);
    console.log("Numero de unidades", numeroUnidades);

    const titulo = document.createElement('h3');
    titulo.textContent = 'Unidades de aprendizaje';

    unidades.appendChild(titulo);

    for (let index = 1; index <= numeroUnidades; index++) {

        var nuevaUnidad = document.createElement('section');
        nuevaUnidad.classList.add('unidades');
        nuevaUnidad.id = 'unidadForm' + index;

        nuevaUnidad.innerHTML =
            `
                <section class="unidades" id="unidadForm${index}">
                    <h4>Unidad ${index}</h4>
                    <div>
                        <label for="UA${index}" class="form-label">UA</label>
                        <input type="text" name="UA${index}" id="UA${index}" placeholder="Nombre de la unidad" required>
                    </div>
    
                    <div>
                        <label for="unidad${index}" class="form-label">Competencia especifica por UA</label>
                        <input type="text" name="unidad${index}" id="unidad${index}" placeholder="Descripción de la unidad" required>
                    </div>
    
                    <div>
                        <label for="semanas${index}" class="form-label">Número de semenas</label>
                        <input type="number" name="semanas${index}" id="semanas${index}" placeholder="Número de semanas" required>
                    </div>
    
                    <div>
                        <label for="resultado${index}" class="form-label">Resultado de aprendizaje</label>
                        <input type="text" name="resultado${index}" id="resultado${index}" placeholder="Número de semanas" required>
                    </div>
    
                    <div>
                        <label for="saber${index}" class="form-label">El Saber</label>
                        <input type="number" name="saber${index}" id="saber${index}" placeholder="Porcentaje de unidad" required>
                    </div>
    
                    <div>
                        <label for="hacer${index}" class="form-label${index}">El hacer-ser</label>
                        <input type="number" name="hacer" id="hacer${index}" placeholder="Porcentaje de unidad" required>
                    </div>
    
                    </section>
            `;
        unidades.appendChild(nuevaUnidad);

    }

}

function guardarDatos(saberTotal, hacerTotal, semanasTotal) {
    const materia = document.getElementById('materia').value;
    const familia = document.getElementById('familia').value;
    const maestro = document.getElementById('maestro').value;
    const duracion = document.getElementById('duracion').value;
    const cuatrimestre = document.getElementById('cuatrimestre').value;
    const unidad = parseInt(document.getElementById('unidad').value);
    const competencia = document.getElementById('competencia').value;
    const objetivo = document.getElementById('objetivo').value;
    var unidades = [];

    for (let index = 1; index <= unidad; index++) {
        const unidad = {
            UA: document.getElementById('UA' + index).value,
            competencia: document.getElementById('unidad' + index).value,
            semanas: document.getElementById('semanas' + index).value,
            resultado: document.getElementById('resultado' + index).value,
            hacer: document.getElementById('hacer' + index).value,
            saber: document.getElementById('saber' + index).value
        }
        unidades.push(unidad);
    }

    const data = {
        id: Math.floor(Math.random() * 100000000),
        materia,
        maestro,
        familia,
        duracion,
        cuatrimestre,
        unidad,
        competencia,
        objetivo,
        unidades,
        saberTotal,
        hacerTotal,
        semanasTotal
    }

    //aca recupero los datos de local
    let datosGuardados = JSON.parse(localStorage.getItem('datos')) || [];
    //aqui agrego el nuevo elemnto
    datosGuardados.push(data);
    //ahora si lo guardo con todo
    localStorage.setItem('datos', JSON.stringify(datosGuardados));

    document.getElementById('formulario').reset();
    document.getElementById('unidades').innerHTML = "";
    
    cargarDatosTabla();
}
