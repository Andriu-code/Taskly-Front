import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Table, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Task from '../Task';
import api from '../../api/api';

function TableTask({ tasks, onTaskUpdate }) {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const toggle = () => setModal(!modal);
    const deleteToggle = () => setModalDelete(!modalDelete); // abrir/cerrar modal

    const handleEditClick = (taskId) => {
        setEditingTaskId(taskId);
        toggle();
    };

    const handleClose = () => {
        setEditingTaskId(null);
        toggle(); // Cierra el formulario de edición
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        deleteToggle(); // Abrir modal de confirmación
    };

    const confirmDeleteTask = async () => {
        await api.delete(`/tasks/${taskToDelete._id}`).then(() => {
            onTaskUpdate(); // Actualiza la lista de tareas
            deleteToggle();
        }).catch((error) => {
            console.log('Error al eliminar tarea', error);
        })
    };

    const formatDate = (taskDate) => {
        const date = new Date(taskDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        // No es necesario llamar a getTasksList aquí
    }, [modal, modalDelete]);

    return (
        <TableContainer>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Titulo</th>
                        <th>Fecha limite</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{task.title}</td>
                            <td>{formatDate(task.date)}</td>
                            <td>{task.status}</td>
                            <td>
                                <ButtonContainer>
                                    <Button color='success'>
                                        <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleEditClick(task._id)} />
                                    </Button>
                                    <Button color='danger'>
                                        <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDeleteClick(task)} />
                                    </Button>
                                </ButtonContainer>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {editingTaskId && (
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Editar Tarea</ModalHeader>
                    <ModalBody>
                        <Task
                            taskId={editingTaskId}
                            onTaskUpdate={onTaskUpdate}
                            onClose={handleClose}
                        />
                    </ModalBody>
                </Modal>
            )}
            {taskToDelete && (
                <Modal isOpen={modalDelete} toggle={deleteToggle}>
                    <ModalHeader toggle={deleteToggle}>Eliminar Tarea</ModalHeader>
                    <ModalBody>
                        <h3>¿Estás seguro de eliminar esta tarea?</h3>
                        <p>{taskToDelete?.title}</p>
                        <Button color="danger" onClick={confirmDeleteTask}>Eliminar</Button>
                        <Button color="secondary" onClick={deleteToggle}>Cancelar</Button>
                    </ModalBody>
                </Modal>
            )}
        </TableContainer>
    );
}

const TableContainer = styled.div`
  display: flex;
  width: 80%;
  margin-left: 10%;
  margin-right: 20%;
  margin-bottom: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export default TableTask;