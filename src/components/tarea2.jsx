import React, { useState, useEffect } from "react";
import axios from "axios";
import { create } from "zustand";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const useDocumentStore = create((set, get) => ({
  documentos: [],
  estadisticas: {},
  loading: false,
  error: null,

  setDocumentos: (documentos) => {
    // Validar documentos antes de establecerlos
    const documentosValidados = validarDocumentos(documentos);
    const estadisticas = calcularEstadisticas(documentosValidados);
    set({ documentos: documentosValidados, estadisticas, error: null });
  },

  fetchDocumentos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );

      const documentosTransformados = response.data.map((item, index) => ({
        id: item.id,
        nombre: `Documento ${item.title.substring(0, 20)}...`,
        categoria: `Categoría ${(index % 4) + 1}`,
        fecha: new Date().toISOString().split("T")[0],
        tamaño: `${Math.floor(Math.random() * 1000) + 100}KB`,
        userId: item.userId,
      }));

      set({
        documentos: validarDocumentos(documentosTransformados),
        estadisticas: calcularEstadisticas(documentosTransformados),
        loading: false,
      });
    } catch (error) {
      set({
        error: "Error al cargar los documentos",
        loading: false,
        documentos: [],
        estadisticas: {},
      });
    }
  },
}));

const validarDocumentos = (documentos) => {
  if (!Array.isArray(documentos)) {
    console.error("Los documentos deben ser un array");
    return [];
  }

  return documentos.filter((doc) => {
    const esValido =
      doc.id != null &&
      doc.nombre != null &&
      doc.categoria != null &&
      doc.fecha != null &&
      doc.tamaño != null;

    if (!esValido) {
      console.warn("Documento inválido encontrado:", doc);
    }

    return esValido;
  });
};

const calcularEstadisticas = (documentos) => {
  if (!documentos || documentos.length === 0) {
    return {};
  }

  return documentos.reduce((acc, doc) => {
    const categoria = doc.categoria || "Sin categoría";
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});
};

const Tarea2 = () => {
  const [tipoGrafico, setTipoGrafico] = useState("barra");
  const [documentosSeleccionados, setDocumentosSeleccionados] = useState([]);

  const { documentos, estadisticas, loading, error, fetchDocumentos } =
    useDocumentStore();

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const datosGrafico = Object.keys(estadisticas).map((categoria) => ({
    categoria,
    cantidad: estadisticas[categoria],
  }));

  // Colores para el gráfico de pastel
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
  ];

  const toggleSeleccion = (index) => {
    setDocumentosSeleccionados((prev) => {
      const existe = prev.some((item) => item.id === documentos[index].id);
      if (existe) {
        return prev.filter((item) => item.id !== documentos[index].id);
      } else {
        return [...prev, documentos[index]];
      }
    });
  };

  const columnas = [
    { key: "nombre", header: "Nombre del Documento" },
    { key: "categoria", header: "Categoría" },
    { key: "fecha", header: "Fecha" },
    { key: "tamaño", header: "Tamaño" },
  ];

  const handleRecargar = () => {
    fetchDocumentos();
    setDocumentosSeleccionados([]);
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-lg shadow-lg mx-2 md:mx-4 my-4 md:my-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
        📊 Dashboard de Documentos
      </h1>

      {loading && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <div className="text-blue-600 font-medium">
            🔄 Cargando documentos...
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 font-medium mb-2">❌ {error}</div>
          <button
            onClick={handleRecargar}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Sección de Estadísticas */}
      <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            📈 Estadísticas de Documentos
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTipoGrafico("barra")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base ${
                tipoGrafico === "barra"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📊 Barras
            </button>
            <button
              onClick={() => setTipoGrafico("pastel")}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base ${
                tipoGrafico === "pastel"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🎯 Pastel
            </button>
            <button
              onClick={handleRecargar}
              className="px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Mensaje si no hay datos suficientes */}
        {datosGrafico.length === 0 && !loading && (
          <div className="mb-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <div className="text-yellow-700 font-medium">
              ℹ️ No hay suficientes datos para mostrar estadísticas
            </div>
            <p className="text-yellow-600 mt-2">
              Los documentos deben tener categorías para generar estadísticas.
            </p>
          </div>
        )}

        {/* Gráficos */}
        {datosGrafico.length > 0 && (
          <div className="h-64 md:h-80 mb-4">
            {tipoGrafico === "barra" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="cantidad"
                    fill="#3B82F6"
                    name="Documentos por Categoría"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ categoria, cantidad }) =>
                      `${categoria}: ${cantidad}`
                    }
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="cantidad"
                    nameKey="categoria"
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Tarjetas de resumen */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {documentos.length}
            </div>
            <div className="text-blue-700 font-medium text-sm md:text-base">
              Total Documentos
            </div>
          </div>
          <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200 text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {Object.keys(estadisticas).length}
            </div>
            <div className="text-green-700 font-medium text-sm md:text-base">
              Categorías
            </div>
          </div>
          <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200 text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {documentosSeleccionados.length}
            </div>
            <div className="text-purple-700 font-medium text-sm md:text-base">
              Seleccionados
            </div>
          </div>
          <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-200 text-center">
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              {datosGrafico.length}
            </div>
            <div className="text-orange-700 font-medium text-sm md:text-base">
              Datos Válidos
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Lista de Documentos */}
      <div className="p-4 md:p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            📋 Lista de Documentos
          </h2>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="text-gray-700 text-base md:text-lg">
              📊 Total:{" "}
              <strong className="text-blue-600">{documentos.length}</strong>
            </span>
            <span className="text-gray-700 text-base md:text-lg">
              ✅ Seleccionados:{" "}
              <strong className="text-green-600">
                {documentosSeleccionados.length}
              </strong>
            </span>
          </div>
        </div>

        {documentos.length > 0 ? (
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-12 p-3 md:p-4 border-b border-gray-300 text-center text-base">
                      ✓
                    </th>
                    {columnas.map((col) => (
                      <th
                        key={col.key}
                        className="p-3 md:p-4 border-b border-gray-300 text-left font-semibold text-gray-700 text-base"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc, index) => {
                    const estaSeleccionado = documentosSeleccionados.some(
                      (item) => item.id === doc.id
                    );
                    return (
                      <tr
                        key={doc.id}
                        className={`cursor-pointer transition-colors duration-150 ${
                          estaSeleccionado
                            ? "bg-blue-50 hover:bg-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleSeleccion(index)}
                      >
                        <td className="p-3 md:p-4 border-b border-gray-300 text-center">
                          {estaSeleccionado ? (
                            <span className="text-green-600 text-base">✅</span>
                          ) : (
                            <span className="text-gray-400 text-base">◻️</span>
                          )}
                        </td>
                        {columnas.map((col) => (
                          <td
                            key={col.key}
                            className="p-3 md:p-4 border-b border-gray-300 text-gray-600 text-base"
                          >
                            {doc[col.key]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="p-8 md:p-12 text-center bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-base md:text-lg shadow-md">
              📭 No hay documentos disponibles para mostrar
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Tarea2;
