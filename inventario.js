// Configura tu Client ID y API Key
const CLIENT_ID = 'TU_CLIENT_ID';
const API_KEY = 'TU_API_KEY';

// ID de la hoja de Google Sheets y el rango donde se escribirán los datos
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID';
const RANGO = 'Hoja1!A:C';

// Permisos que solicitará la API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

function iniciarAPI() {
  gapi.load('client:auth2', async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      scope: SCOPES,
    });
  });
}

// Autenticar y enviar datos
async function enviarDatos(datos) {
  try {
    await gapi.auth2.getAuthInstance().signIn();
    const respuesta = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGO,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [datos],
      },
    });

    console.log('Datos enviados:', respuesta);
    document.getElementById('estado').textContent = 'Datos enviados correctamente';
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    document.getElementById('estado').textContent = 'Error al enviar los datos';
  }
}

// Manejar el formulario
document.getElementById('miFormulario').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const comentario = document.getElementById('comentario').value;
  
  const datos = [nombre, email, comentario];
  enviarDatos(datos);
});

// Inicializar la API al cargar el archivo
window.onload = iniciarAPI;
// Cargar datos del localStorage cuando la página se carga
window.onload = loadDataFromLocalStorage;
