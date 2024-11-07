async function loadGoogleSheetsData() {
    const apiKey = 'AIzaSyBISm7aiAzX16OJop6rwemuAdFc3JLeSBw'; // Tu API Key
    const spreadsheetId = '1QVYqsPy559Mo2f-iqImH4wtcW-vDY-pBFeXrOMDh2i0'; // ID de la hoja de cálculo
    const range = 'CICLICO!A:D'; // Nombre de la hoja actualizado

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data); // Imprime la respuesta para verificar

        if (data.values) {
            // Limpiar la tabla antes de cargar nuevos datos
            document.getElementById('itemList').innerHTML = '';

            // Agregar los datos de Google Sheets a la tabla
            data.values.forEach(row => {
                const [code, name, quantitySystem, quantityPhysical] = row.map(cell => cell.trim());
                if (code && name && quantitySystem && quantityPhysical) {
                    addItemToTable(code, name, quantitySystem, quantityPhysical);
                }
            });
        } else {
            alert('No se pudieron cargar los datos de Google Sheets.');
        }
    } catch (error) {
        console.error('Error al cargar datos de Google Sheets:', error);
        alert('Hubo un error al intentar cargar los datos desde Google Sheets.');
    }
}
