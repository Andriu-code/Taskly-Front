import React, { useState, useEffect } from "react";
import Task from "./Components/Task";
import TableTask from "./Components/TableTasks/TableTask";
import styled from "styled-components";
import TaskFilter from "./Components/TaskFilter";
import api from "../src/api/api";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";


function App({ args }) {
  const [tasksFiltradas, setTasksFiltradas] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('todas'); // 'todas', 'completada', 'incompleta'
  const [sortOption, setSortOption] = useState('fecha'); // 'fecha', 'titulo', 'estado'
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal); // abrir/cerrar modal


  const getTasksList = () => {
    api.get('/tasks')
      .then((response) => {
        const tasksArray = response.data.body;
        setTasks(tasksArray);
      })
      .catch((error) => {
        console.log("Error obteniendo lista de tareas", error);
      });
  }

  useEffect(() => {
    // Obtener todas las tareas
    getTasksList();
  }, []);

  useEffect(() => {
    // Filtrar y ordenar tareas solo cuando `tasks`, `filter`, o `sortOption` cambien
    const applyFilterAndSort = () => {
      const filtered = tasks.filter(task => {
        if (filter === 'completada') return task.status === "Completada";
        if (filter === 'incompleta') return task.status === "Incompleta";
        return true; // 'todas' o cualquier otro valor
      });

      const sorted = filtered.sort((a, b) => {
        if (sortOption === 'fecha') return new Date(a.deadline) - new Date(b.deadline);
        if (sortOption === 'titulo') return a.title.localeCompare(b.title);
        if (sortOption === 'estado') return a.status.localeCompare(b.status);
        return 0;
      });

      setFilteredTasks(sorted);
    };
    applyFilterAndSort();

  }, [tasks, filter, sortOption]);


  return (
    <PrincipalContainer>
      <TitleContainer><h1>Taskly </h1></TitleContainer>
      <BodyContainer>
        <CreateTaskContainerButton>
          <Button size={"lg"} color="info" onClick={toggle}>+ Crear tarea</Button>
        </CreateTaskContainerButton>
        <Modal isOpen={modal} toggle={toggle} {...args}>
          <ModalHeader toggle={toggle}>Crear Tarea</ModalHeader>
          <ModalBody>
            <Task onTaskUpdate={getTasksList} onClose={toggle} />
          </ModalBody>
        </Modal>
        <TableInfoContainer>
          <TaskFilter setFilter={setFilter} setSortOption={setSortOption} />
          <TableTask tasks={filteredTasks} onTaskUpdate={getTasksList} />
        </TableInfoContainer>
      </BodyContainer>
    </PrincipalContainer>
  );
}

const PrincipalContainer = styled.div`
  display: flex;
  width: 100%; 
  flex-direction: column;
  box-sizing: border-box; 
  background-color: #f0f0f0;
`
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`
const CreateTaskContainerButton = styled.div`
  display: flex;
  height: 50px;
  margin-left: 60%;
  margin-top: 2%;
  flex-direction: row;
`

const BodyContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const TableInfoContainer = styled.div`
 display: flex;
  flex-direction: column;
  width: 100%; 
`

export default App;
