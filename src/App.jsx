import "./App.css";
import TablaDinamica from "./components/TablaDinamica";

function App() {
  const datosEjemplo = [
    { id: 1, nombre: "Juan", email: "juan@email.com", edad: 25 },
    { id: 2, nombre: "María", email: "maria@email.com", edad: 30 },
    { id: 3, nombre: "Carlos", email: "carlos@email.com", edad: 28 },
  ];

  const columnasEjemplo = [
    { key: "id", header: "ID" },
    { key: "nombre", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "edad", header: "Edad" },
  ];

  return (
    <>
      <div className="App">
        <h1>Tabla Dinámica</h1>
        <TablaDinamica datos={datosEjemplo} columnas={columnasEjemplo} />
      </div>
    </>
  );
}

export default App;
