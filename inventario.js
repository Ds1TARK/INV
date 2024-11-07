// Función para agregar artículos a la tabla
document.getElementById('itemForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const itemInput = document.getElementById('itemInput').value;
    const items = itemInput.split('\n');

    items.forEach(item => {
        const [code, name, quantitySystem, quantityPhysical] = item.split(',').map(i => i.trim());
        if (code && name && quantitySystem && quantityPhysical) {
            addItemToTable(code, name, quantitySystem, quantityPhysical);
        }
    });

    document.getElementById('itemForm').reset();
    saveDataToLocalStorage();
});

// Función para agregar un artículo a la tabla
function addItemToTable(code, name, quantitySystem, quantityPhysical) {
    const row = document.createElement('tr');
    row.innerHTML = 
        <td>${code}</td>
        <td>${name}</td>
        <td><input type="number" value="${quantitySystem}" min="0" readonly></td>
        <td><input type="number" value="${quantityPhysical}" min="0"></td>
    ;
    document.getElementById('itemList').appendChild(row);
}

// Función para guardar los datos en localStorage
function saveDataToLocalStorage() {
    const rows = Array.from(document.querySelectorAll('#itemList tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            code: cells[0].textContent,
            name: cells[1].textContent,
            quantitySystem: cells[2].querySelector('input').value,
            quantityPhysical: cells[3].querySelector('input').value,
        };
    });
    localStorage.setItem('inventoryData', JSON.stringify(rows));
}

// Función para cargar los datos de localStorage
function loadDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('inventoryData') || '[]');
    data.forEach(item => {
        addItemToTable(item.code, item.name, item.quantitySystem, item.quantityPhysical);
    });
}

// Función para exportar el inventario a un archivo Excel
function exportToExcel() {
    const rows = Array.from(document.querySelectorAll('#itemList tr')).map(row => {
        const cells = row.querySelectorAll('td');
        const quantitySystem = cells[2].querySelector('input').value;
        const quantityPhysical = cells[3].querySelector('input').value;
        return [
            cells[0].textContent,
            cells[1].textContent,
            quantitySystem,
            quantityPhysical
        ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([["Código", "Artículo", "Cantidad en Sistema", "Cantidad en Físico"], ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(excelFile)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventario_articulos.xlsx";
    link.click();
}

// Función para convertir una cadena a un ArrayBuffer
function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

// Función para enviar el archivo Excel a Telegram
function sendExcelToTelegram() {
    const rows = Array.from(document.querySelectorAll('#itemList tr')).map(row => {
        const cells = row.querySelectorAll('td');
        const quantitySystem = cells[2].querySelector('input').value;
        const quantityPhysical = cells[3].querySelector('input').value;
        return [
            cells[0].textContent,
            cells[1].textContent,
            quantitySystem,
            quantityPhysical
        ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([["Código", "Artículo", "Cantidad en Sistema", "Cantidad en Físico"], ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(excelFile)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const formData = new FormData();
    formData.append("file", blob, "inventario_articulos.xlsx");

    const token = '7858773010:AAF3NfqFHkMTz446FjvdynGYxNAgzzQTnZg'; // Reemplaza con tu token
    const chatId = '5712491335'; // Reemplaza con tu chat_id

    const url = https://api.telegram.org/bot${token}/sendDocument?chat_id=${chatId};

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Archivo enviado correctamente a Telegram');
        } else {
            alert('Error al enviar el archivo a Telegram');
        }
    })
    .catch(error => {
        console.error('Error al enviar el archivo a Telegram:', error);
        alert('Hubo un problema al enviar el archivo.');
    });
}

// Cargar datos del localStorage cuando la página se carga
window.onload = loadDataFromLocalStorage;
