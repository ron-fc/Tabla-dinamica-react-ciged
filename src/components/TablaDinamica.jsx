import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TablaDinamica = ({ datos = [], columnas = [] }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [datosSeleccionados, setDatosSeleccionados] = useState([]);

  const mostrarMensaje = (texto, tipo = "error") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  const validarExportacion = () => {
    if (datos.length === 0) {
      mostrarMensaje("No hay datos disponibles para exportar", "error");
      return false;
    }

    if (datosSeleccionados.length > 0) {
      return true;
    }

    if (datos.length > 0) {
      return true;
    }

    mostrarMensaje("No hay registros disponibles para exportar", "error");
    return false;
  };

  const exportarCSV = () => {
    if (!validarExportacion()) return;

    const datosAExportar =
      datosSeleccionados.length > 0 ? datosSeleccionados : datos;

    try {
      const ws = XLSX.utils.json_to_sheet(datosAExportar);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const nombreArchivo =
        datosSeleccionados.length > 0
          ? "datos_seleccionados.csv"
          : "datos_completos.csv";

      saveAs(blob, nombreArchivo);
      setMostrarOpciones(false);

      mostrarMensaje(
        `✅ ${datosAExportar.length} registros exportados exitosamente en CSV`,
        "exito"
      );
    } catch (error) {
      console.error("Error en exportación CSV:", error);
      mostrarMensaje("Error al exportar el archivo CSV", "error");
    }
  };

  const exportarXLSX = () => {
    if (!validarExportacion()) return;

    const datosAExportar =
      datosSeleccionados.length > 0 ? datosSeleccionados : datos;

    try {
      const ws = XLSX.utils.json_to_sheet(datosAExportar);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");

      const nombreArchivo =
        datosSeleccionados.length > 0
          ? "datos_seleccionados.xlsx"
          : "datos_completos.xlsx";

      XLSX.writeFile(wb, nombreArchivo);
      setMostrarOpciones(false);

      mostrarMensaje(
        `✅ ${datosAExportar.length} registros exportados exitosamente en Excel`,
        "exito"
      );
    } catch (error) {
      console.error("Error en exportación Excel:", error);
      mostrarMensaje("Error al exportar el archivo Excel", "error");
    }
  };

  const toggleSeleccion = (index) => {
    setDatosSeleccionados((prev) => {
      const existe = prev.some((item) => item.id === datos[index].id);
      if (existe) {
        return prev.filter((item) => item.id !== datos[index].id);
      } else {
        return [...prev, datos[index]];
      }
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg mx-4 my-6">
      {mensaje.texto && (
        <div
          className={`p-4 mb-4 rounded-lg border ${
            mensaje.tipo === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          } font-bold`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Contenedor de estadísticas con sombreado y redondeado */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <span className="text-gray-700 text-lg">
          📊 Total de registros:{" "}
          <strong className="text-blue-600">{datos.length}</strong>
        </span>
        <span className="text-gray-700 text-lg">
          ✅ Seleccionados:{" "}
          <strong className="text-green-600">
            {datosSeleccionados.length}
          </strong>
        </span>
      </div>

      <div className="relative inline-block mb-6">
        <button
          onClick={() => setMostrarOpciones(!mostrarOpciones)}
          className="px-6 py-3 bg-blue-600 text-white border-none rounded-lg cursor-pointer text-base font-bold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
        >
          Exportar Datos
        </button>

        {mostrarOpciones && (
          <div className="absolute top-full left-0 bg-white border border-gray-400 rounded-lg shadow-xl z-50 mt-2 min-w-[180px] overflow-hidden">
            <button
              onClick={exportarCSV}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150 text-gray-700 font-medium"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportarXLSX}
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-gray-700 font-medium"
            >
              Exportar Excel
            </button>
          </div>
        )}
      </div>

      {datos.length > 0 ? (
        <div className="border border-gray-400 rounded-lg overflow-hidden shadow-md bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-12 p-4 border-b border-gray-400 text-center text-lg">
                  ✓
                </th>
                {columnas.map((col) => (
                  <th
                    key={col.key}
                    className="p-4 border-b border-gray-400 text-left font-semibold text-gray-700 text-lg"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datos.map((fila, index) => {
                const estaSeleccionado = datosSeleccionados.some(
                  (item) => item.id === fila.id
                );
                return (
                  <tr
                    key={index}
                    className={`cursor-pointer transition-colors duration-150 ${
                      estaSeleccionado
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleSeleccion(index)}
                  >
                    <td className="p-4 border-b border-gray-400 text-center">
                      {estaSeleccionado ? (
                        <span className="text-green-600 text-lg">✅</span>
                      ) : (
                        <span className="text-gray-400 text-lg">◻️</span>
                      )}
                    </td>
                    {columnas.map((col) => (
                      <td
                        key={col.key}
                        className="p-4 border-b border-gray-400 text-gray-600 text-lg"
                      >
                        {fila[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-lg shadow-md">
          📭 No hay datos disponibles para mostrar
        </div>
      )}
    </div>
  );
};

export default TablaDinamica;
