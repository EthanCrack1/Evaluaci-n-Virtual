const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

function reiniciarExcel() {
  const ruta = process.env.RAILWAY_ENVIRONMENT ? "/tmp/resultados.xlsx" : path.join(__dirname, "../resultados.xlsx");

  const hoja = xlsx.utils.aoa_to_sheet([["Posición", "Nombre", "Apellido", "Puntuación", "Tiempo"]]);
  const libro = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(libro, hoja, "Respuestas");

  xlsx.writeFile(libro, ruta);
  console.log("🧼 Excel reiniciado con encabezados");
}

module.exports = reiniciarExcel;
