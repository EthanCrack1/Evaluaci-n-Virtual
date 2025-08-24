const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const guardarEnExcel = require("./excel-handler");
const fs = require("fs");
const reiniciarExcel = require("./reiniciar-excel");
const app = express();

// Middleware base
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Servir frontend estático desde la raíz
app.use(express.static(path.join(__dirname, "../")));

// Recibir respuestas y guardar en Excel
app.post("/api/guardar", (req, res) => {
  const datos = req.body;
  console.log("📥 Respuesta recibida:", datos);

  try {
    guardarEnExcel(datos);
    console.log("📁 Excel actualizado");
    res.send({ status: "ok" });
  } catch (error) {
    console.error("❌ Error al guardar en Excel:", error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

// Ruta pública para descargar el Excel
app.get("/descargar", (req, res) => {
  const ruta = process.env.RAILWAY_ENVIRONMENT ? "/tmp/resultados.xlsx" : path.join(__dirname, "../resultados.xlsx");
  console.log("🔎 Verificando archivo Excel:", ruta);
  if (fs.existsSync(ruta)) {
    res.download(ruta);
  } else {
    res.status(404).send("Archivo no encontrado");
  }
});

// Reiniciar el archivo Excel
app.get("/reiniciar", (req, res) => {
  reiniciarExcel();
  res.send("✅ Excel vaciado");
});

// Iniciar servidor en puerto dinámico
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en el puerto ${PORT}`);
});
