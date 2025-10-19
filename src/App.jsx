import "./App.css";
import TablaDinamica from "./components/TablaDinamica";
import Tarea2 from "./components/tarea2";

function App() {
  //Tarea 2
  // Ejemplo de datos para pasar al componente
  const documentosEjemplo = [
    {
      id: 1,
      nombre: "Informe Trimestral Q1",
      categoria: "Informes",
      fecha: "2024-01-15",
      tamaño: "2.4 MB",
    },
    {
      id: 2,
      nombre: "Contrato Cliente A",
      categoria: "Contratos",
      fecha: "2024-01-10",
      tamaño: "1.8 MB",
    },
    {
      id: 3,
      nombre: "Presentación Ejecutiva",
      categoria: "Presentaciones",
      fecha: "2024-01-08",
      tamaño: "5.2 MB",
    },
    {
      id: 4,
      nombre: "Informe Trimestral Q2",
      categoria: "Informes",
      fecha: "2024-01-05",
      tamaño: "3.1 MB",
    },
    {
      id: 5,
      nombre: "Políticas de la Empresa",
      categoria: "Documentación",
      fecha: "2024-01-03",
      tamaño: "4.7 MB",
    },
    {
      id: 6,
      nombre: "Manual de Usuario",
      categoria: "Documentación",
      fecha: "2024-01-02",
      tamaño: "3.5 MB",
    },
    {
      id: 7,
      nombre: "Acuerdo de Confidencialidad",
      categoria: "Contratos",
      fecha: "2024-01-01",
      tamaño: "1.2 MB",
    },
  ];

  // En tu componente padre o App.js:
  function App() {
    return (
      <div className="App">
        <Tarea2 documentos={documentosEjemplo} />
      </div>
    );
  }

  // const datosEjemplo = [
  //   { id: 1, nombre: "Juan", email: "juan@email.com", edad: 25 },
  //   { id: 2, nombre: "María", email: "maria@email.com", edad: 30 },
  //   { id: 3, nombre: "Carlos", email: "carlos@email.com", edad: 28 },
  // ];

  // const columnasEjemplo = [
  //   { key: "id", header: "ID" },
  //   { key: "nombre", header: "Nombre" },
  //   { key: "email", header: "Email" },
  //   { key: "edad", header: "Edad" },
  // ];

  return (
    <>
      <div className="App">
        {/* <h1>Tabla Dinámica</h1>
        <TablaDinamica datos={datosEjemplo} columnas={columnasEjemplo} /> */}

        <Tarea2 documentos={documentosEjemplo} />
      </div>
    </>
  );
}

export default App;
