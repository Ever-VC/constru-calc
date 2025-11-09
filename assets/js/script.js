const VARILLA_LARGO_M = 6.0;
const QUINTAL_CONVERSION = {
    '1/4': 30,
    '3/8': 14,
    '1/2': 8,
    '5/8': 5,
    '3/4': 3
};
const DOBLEZ_CORRECCION = {
    '1/4': 1.0,
    '3/8': 1.5,
    '1/2': 1.5
};

let calculationId = 0;

function varillasToQuintales(varillas, grosor) {
    const varillasPorQuintal = QUINTAL_CONVERSION[grosor];
    if (varillasPorQuintal) {
        const quintales = (varillas / varillasPorQuintal).toFixed(2);
        return `${quintales} Q`;
    }
    return `N/D`;
}

function generateDynamicFields(type, id) {
    let html = '<div class="row g-3 mt-3">';
    
    if (type === 'Normal') {
        html += `
            <div class="col-md-4 col-12">
                <label class="form-label">Cant. Varillas Longitudinales</label>
                <input type="number" id="col-${id}-varillas" class="form-control" value="4" min="2" step="1">
            </div>
            <div class="col-md-4 col-12">
                <label class="form-label">Ancho del Estribo (cm)</label>
                <input type="number" id="col-${id}-ancho" class="form-control" value="15" min="5" step="1">
            </div>
            <div class="col-md-4 col-12">
                <label class="form-label">Alto del Estribo (cm)</label>
                <input type="number" id="col-${id}-alto" class="form-control" value="20" min="5" step="1">
            </div>
        `;
    } else if (type === 'Cangrejo') {
        html += `
            <div class="col-md-6 col-12">
                <label class="form-label">Ancho del Estribo (cm)</label>
                <input type="number" id="col-${id}-ancho" class="form-control" value="15" min="5" step="1">
            </div>
            <div class="col-12">
                <small class="text-muted">* Este tipo usa 2 varillas longitudinales fijas.</small>
            </div>
        `;
    } else if (type === 'Triangular') {
        html += `
            <div class="col-md-6 col-12">
                <label class="form-label">Medida de un Lado del Estribo (cm)</label>
                <input type="number" id="col-${id}-lado" class="form-control" value="15" min="5" step="1">
            </div>
            <div class="col-12">
                <small class="text-muted">* Este tipo usa 3 varillas longitudinales fijas.</small>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function generateColumnFormHTML(id) {
    return `
        <div class="card p-3 mb-4" id="col-form-${id}">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="text-primary mb-0">
                    <i class="fas fa-columns"></i> Columna #${id}
                </h5>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeColumnForm(${id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
            
            <div class="row g-3">
                <div class="col-12">
                    <label class="form-label">Título del Cálculo</label>
                    <input type="text" id="col-${id}-title" class="form-control" value="Columna Principal ${id}">
                </div>
                <div class="col-md-6 col-lg-3">
                    <label class="form-label">Tipo de Columna</label>
                    <select id="col-${id}-type" class="form-select" onchange="updateDynamicFields(${id})">
                        <option value="Normal" selected>Normal</option>
                        <option value="Cangrejo">Cangrejo (2 Var.)</option>
                        <option value="Triangular">Triangular (3 Var.)</option>
                    </select>
                </div>
                <div class="col-md-6 col-lg-3">
                    <label class="form-label">Metros Lineales (m)</label>
                    <input type="number" id="col-${id}-metros" class="form-control" value="3.0" min="0.1" step="0.1">
                </div>
                <div class="col-md-6 col-lg-3">
                    <label class="form-label">Empalme (m)</label>
                    <input type="number" id="col-${id}-empalme" class="form-control" value="0.60" min="0.01" step="0.01">
                </div>
                <div class="col-md-6 col-lg-3">
                    <label class="form-label">Distancia Estribos (m)</label>
                    <input type="number" id="col-${id}-distancia-estribo" class="form-control" value="0.20" min="0.01" step="0.01">
                </div>
                <div class="col-md-6 col-lg-4">
                    <label class="form-label">Grosor Varilla Columna</label>
                    <select id="col-${id}-grosor-col" class="form-select">
                        <option value="3/8" selected>3/8"</option>
                        <option value="1/2">1/2"</option>
                        <option value="5/8">5/8"</option>
                        <option value="3/4">3/4"</option>
                    </select>
                </div>
                <div class="col-md-6 col-lg-4">
                    <label class="form-label">Grosor Varilla Estribo</label>
                    <select id="col-${id}-grosor-estribo" class="form-select">
                        <option value="1/4" selected>1/4"</option>
                        <option value="3/8">3/8"</option>
                        <option value="1/2">1/2"</option>
                    </select>
                </div>
                
                <div class="col-12" id="col-${id}-dynamic-fields">
                    ${generateDynamicFields('Normal', id)}
                </div>
            </div>
        </div>
    `;
}

function addColumnForm() {
    calculationId++;
    const container = document.getElementById('column-forms-container');
    container.insertAdjacentHTML('beforeend', generateColumnFormHTML(calculationId));
}

function removeColumnForm(id) {
    const formElement = document.getElementById(`col-form-${id}`);
    if (formElement) formElement.remove();
}

function updateDynamicFields(id) {
    const type = document.getElementById(`col-${id}-type`).value;
    const dynamicContainer = document.getElementById(`col-${id}-dynamic-fields`);
    dynamicContainer.innerHTML = generateDynamicFields(type, id);
}

function toggleBastonForm() {
    const form = document.getElementById('baston-form-container');
    const checkbox = document.getElementById('add-bastones-check');
    form.style.display = checkbox.checked ? 'block' : 'none';
}

function calculateColumn(id) {
    const title = document.getElementById(`col-${id}-title`).value;
    const type = document.getElementById(`col-${id}-type`).value;
    const L = parseFloat(document.getElementById(`col-${id}-metros`).value);
    const Le = parseFloat(document.getElementById(`col-${id}-empalme`).value);
    const De = parseFloat(document.getElementById(`col-${id}-distancia-estribo`).value);
    const grosorCol = document.getElementById(`col-${id}-grosor-col`).value;
    const grosorEstribo = document.getElementById(`col-${id}-grosor-estribo`).value;

    let N_varillas_col = 0;
    let Perimetro_Estribo_cm = 0;
    let N_dobleces = 0;
    let gancho_cm = 0;

    if (type === 'Normal') {
        N_varillas_col = parseInt(document.getElementById(`col-${id}-varillas`).value);
        const Ancho = parseFloat(document.getElementById(`col-${id}-ancho`).value);
        const Alto = parseFloat(document.getElementById(`col-${id}-alto`).value);
        N_dobleces = 4;
        gancho_cm = 6;
        Perimetro_Estribo_cm = (2 * (Ancho + Alto));
    } else if (type === 'Cangrejo') {
        N_varillas_col = 2;
        const Ancho = parseFloat(document.getElementById(`col-${id}-ancho`).value);
        N_dobleces = 2;
        gancho_cm = 2;
        Perimetro_Estribo_cm = (2 * Ancho);
    } else if (type === 'Triangular') {
        N_varillas_col = 3;
        const Lado = parseFloat(document.getElementById(`col-${id}-lado`).value);
        N_dobleces = 3;
        gancho_cm = 3;
        Perimetro_Estribo_cm = (3 * Lado);
    }

    const Metros_Columna_por_Varilla = L + ((L / VARILLA_LARGO_M) * Le);
    const N_varillas_lineales = Math.ceil(Metros_Columna_por_Varilla / VARILLA_LARGO_M);
    const Varillas_Longitudinales_Total = N_varillas_lineales * N_varillas_col;
    const Metros_Longitudinales_Total = Varillas_Longitudinales_Total * VARILLA_LARGO_M;

    const Correccion_Dobleces_cm = DOBLEZ_CORRECCION[grosorEstribo] * N_dobleces;
    const Longitud_Pieza_Estribo_cm = Perimetro_Estribo_cm + Correccion_Dobleces_cm + gancho_cm;
    const N_estribos = Math.ceil(L / De) + 1;
    const Metros_Estribo_Necesario_Total = (Longitud_Pieza_Estribo_cm * N_estribos) / 100;
    const Varillas_Estribo_Total = Math.ceil(Metros_Estribo_Necesario_Total / VARILLA_LARGO_M);
    const Metros_Estribo_Comprado_Total = Varillas_Estribo_Total * VARILLA_LARGO_M;

    const totalMetros = Metros_Longitudinales_Total + Metros_Estribo_Comprado_Total;
    const totalVarillas = Varillas_Longitudinales_Total + Varillas_Estribo_Total;

    const quintalesCol = varillasToQuintales(Varillas_Longitudinales_Total, grosorCol);
    const quintalesEstribo = varillasToQuintales(Varillas_Estribo_Total, grosorEstribo);

    let varillas_por_grosor = {};
    varillas_por_grosor[grosorCol] = (varillas_por_grosor[grosorCol] || 0) + Varillas_Longitudinales_Total;
    varillas_por_grosor[grosorEstribo] = (varillas_por_grosor[grosorEstribo] || 0) + Varillas_Estribo_Total;

    return {
        title,
        total_metros: totalMetros,
        total_varillas: totalVarillas,
        varillas_por_grosor: varillas_por_grosor,
        detalle: {
            varillas_longitudinales: {
                cantidad: Varillas_Longitudinales_Total,
                grosor: grosorCol,
                metros: Metros_Longitudinales_Total,
                quintales: quintalesCol
            },
            estribos: {
                cantidad: Varillas_Estribo_Total,
                grosor: grosorEstribo,
                metros: Metros_Estribo_Comprado_Total,
                N_piezas: N_estribos,
                long_pieza_cm: Longitud_Pieza_Estribo_cm.toFixed(2),
                quintales: quintalesEstribo
            }
        }
    };
}

function calculateBastones() {
    const checkbox = document.getElementById('add-bastones-check');
    if (!checkbox.checked) return null;

    const L_total = parseFloat(document.getElementById('baston-metros').value);
    const H_pared = parseFloat(document.getElementById('baston-altura').value);
    const grosorBaston = document.getElementById('baston-grosor').value;
    const D_baston = parseFloat(document.getElementById('baston-distancia').value);
    const L_empalme = parseFloat(document.getElementById('baston-empalme-largo').value);
    const PATA_CM = 20;

    const N_tramos = Math.ceil(H_pared / VARILLA_LARGO_M);
    const N_empalmes = (N_tramos === 1 && H_pared < 2.8) ? 1 : N_tramos;

    const Largo_Baston_m = H_pared + (N_empalmes * L_empalme) + (PATA_CM / 100);
    const N_bastones = Math.ceil(L_total / D_baston) + 1;
    const Metros_Necesarios = Largo_Baston_m * N_bastones;
    const Varillas_Bastones_Total = Math.ceil(Metros_Necesarios / VARILLA_LARGO_M);
    const Metros_Comprados_Total = Varillas_Bastones_Total * VARILLA_LARGO_M;

    const quintalesBaston = varillasToQuintales(Varillas_Bastones_Total, grosorBaston);

    let varillas_por_grosor = {};
    varillas_por_grosor[grosorBaston] = Varillas_Bastones_Total;

    return {
        title: 'Bastones (Verticales)',
        total_metros: Metros_Comprados_Total,
        total_varillas: Varillas_Bastones_Total,
        varillas_por_grosor: varillas_por_grosor,
        detalle: {
            largo_pieza_m: Largo_Baston_m.toFixed(2),
            N_piezas: N_bastones,
            N_empalmes: N_empalmes,
            grosor: grosorBaston,
            quintales: quintalesBaston
        }
    };
}

function calculateAll() {
    const formIds = Array.from(document.querySelectorAll('.card[id^="col-form-"]'))
        .map(el => parseInt(el.id.replace('col-form-', '')))
        .filter(id => !isNaN(id));

    let globalTotalMetros = 0;
    let globalTotalVarillas = 0;
    let globalVarillasPorGrosor = {};
    let individualResultsHTML = '';

    formIds.forEach(id => {
        try {
            const result = calculateColumn(id);
            globalTotalMetros += result.total_metros;
            globalTotalVarillas += result.total_varillas;

            for (const grosor in result.varillas_por_grosor) {
                globalVarillasPorGrosor[grosor] = (globalVarillasPorGrosor[grosor] || 0) + result.varillas_por_grosor[grosor];
            }

            individualResultsHTML += `
                <div class="result-item">
                    <h5 class="text-warning mb-3">
                        <i class="fas fa-column"></i> ${result.title}
                    </h5>
                    <p class="mb-2">
                        <strong>Total Varillas:</strong> 
                        <span class="badge badge-custom">${result.total_varillas}</span>
                    </p>
                    <hr class="border-secondary">
                    <p class="mb-1">
                        <strong>Varillas Longitudinales (${result.detalle.varillas_longitudinales.grosor}"):</strong>
                        ${result.detalle.varillas_longitudinales.cantidad} varillas
                        <span class="text-success">(${result.detalle.varillas_longitudinales.quintales})</span>
                    </p>
                    <p class="mb-1">
                        <strong>Estribos (${result.detalle.estribos.grosor}"):</strong>
                        ${result.detalle.estribos.cantidad} varillas
                        <span class="text-success">(${result.detalle.estribos.quintales})</span>
                    </p>
                    <small class="text-muted d-block mt-2">
                        Piezas: ${result.detalle.estribos.N_piezas} de ${result.detalle.estribos.long_pieza_cm}cm
                    </small>
                </div>
            `;

        } catch (e) {
            console.error(`Error en cálculo de columna #${id}:`, e);
        }
    });

    const bastonResult = calculateBastones();
    if (bastonResult) {
        globalTotalMetros += bastonResult.total_metros;
        globalTotalVarillas += bastonResult.total_varillas;

        for (const grosor in bastonResult.varillas_por_grosor) {
            globalVarillasPorGrosor[grosor] = (globalVarillasPorGrosor[grosor] || 0) + bastonResult.varillas_por_grosor[grosor];
        }

        individualResultsHTML += `
            <div class="result-item" style="border-left: 3px solid #28a745;">
                <h5 class="text-success mb-3">
                    <i class="fas fa-ruler"></i> ${bastonResult.title}
                </h5>
                <p class="mb-2">
                    <strong>Total Varillas:</strong>
                    <span class="badge badge-custom">${bastonResult.total_varillas}</span>
                </p>
                <hr class="border-secondary">
                <p class="mb-1">
                    <strong>Varillas (${bastonResult.detalle.grosor}"):</strong>
                    ${bastonResult.total_varillas} varillas
                    <span class="text-success">(${bastonResult.detalle.quintales})</span>
                </p>
                <small class="text-muted d-block mt-2">
                    Largo por Bastón: ${bastonResult.detalle.largo_pieza_m} m 
                    (Total Piezas: ${bastonResult.detalle.N_piezas})
                </small>
                <small class="text-warning d-block mt-1">
                    Empalmes por bastón: ${bastonResult.detalle.N_empalmes}
                </small>
            </div>
        `;
    }

    let quintalesHTML = '';
    let totalQuintalesGlobal = 0;

    for (const grosor in globalVarillasPorGrosor) {
        const totalVarillasGrosor = globalVarillasPorGrosor[grosor];
        const varillasPorQuintal = QUINTAL_CONVERSION[grosor];

        if (varillasPorQuintal) {
            const quintales = (totalVarillasGrosor / varillasPorQuintal).toFixed(2);
            totalQuintalesGlobal += parseFloat(quintales);
            quintalesHTML += `
                <div class="result-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span><strong>${grosor}":</strong> ${totalVarillasGrosor} varillas</span>
                        <span class="badge badge-custom fs-5">${quintales} Q</span>
                    </div>
                </div>
            `;
        }
    }

    if (quintalesHTML === '') {
        quintalesHTML = '<p class="text-muted">No se realizaron cálculos.</p>';
    }

    document.getElementById('total-metros').textContent = globalTotalMetros.toFixed(2) + ' m';
    document.getElementById('total-varillas').textContent = globalTotalVarillas.toFixed(0);
    document.getElementById('total-quintales').textContent = totalQuintalesGlobal.toFixed(2) + ' Q';
    document.getElementById('quintales-results').innerHTML = quintalesHTML;
    document.getElementById('individual-results-list').innerHTML = individualResultsHTML;

    document.getElementById('results-container').style.display = 'block';
    document.getElementById('results-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.onload = function() {
    if (!QUINTAL_CONVERSION['5/8']) QUINTAL_CONVERSION['5/8'] = 5;
    if (!QUINTAL_CONVERSION['3/4']) QUINTAL_CONVERSION['3/4'] = 3;
    addColumnForm();
};