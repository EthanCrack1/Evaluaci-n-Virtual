const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

module.exports = function (data) {
  // Ruta absoluta para compatibilidad
  const file = process.env.RAILWAY_ENVIRONMENT ? "/tmp/resultados.xlsx" : path.join(__dirname, "../resultados.xlsx");

  let workbook, hoja;

  if (fs.existsSync(file)) {
    workbook = xlsx.readFile(file);
    hoja = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    hoja = xlsx.utils.aoa_to_sheet([
      ["Posición", "Nombre", "Apellido", "Puntuación", "Tiempo"]
    ]);
    workbook = xlsx.utils.book_new();
    workbook.SheetNames.push("Respuestas");
  }

  // Calcular la posición (número de fila actual)
  let posicion = 1;
  if (hoja['!ref']) {
    const range = xlsx.utils.decode_range(hoja['!ref']);
    posicion = range.e.r;
    // Si es la primera fila (encabezado), la siguiente es 1
    if (posicion === 0) {
      posicion = 1;
    } else {
      posicion = posicion + 1;
    }
  }
  // Añadir nueva fila solo con los datos requeridos
  const nuevaFila = [[
    posicion,
    data.nombre,
    data.apellido,
    data.score,
    data.tiempo
  ]];
  xlsx.utils.sheet_add_aoa(hoja, nuevaFila, { origin: -1 });

  // Asegurar que la hoja esté correctamente referenciada
  workbook.Sheets["Respuestas"] = hoja;

  // Guardar el archivo
  xlsx.writeFile(workbook, file);
  console.log("✅ Excel actualizado correctamente.");
};
