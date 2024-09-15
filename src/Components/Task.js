import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import api from '../api/api'
import { Form, FormGroup, Label, Input, Button, Col } from 'reactstrap'

function Task({ taskId, onClose, onTaskUpdate }) { //task component

    const initialFormTaskValues = {
        title: '',
        description: '',
        date: '',
        status: 'Incompleta'
    };

    const [formTaskValues, setFormTaskValues] = useState(initialFormTaskValues);

    const handleTaskInputChange = (e) => {
        const { name, value } = e.target;
        setFormTaskValues({
            ...formTaskValues, // Mantiene los otros valores
            [name]: value  // Actualiza el valor del input que está cambiando
        });
    };

    const createTask = async (task) => {
        await api.post('/tasks', task)
            .then((response) => {
                onTaskUpdate();
                onClose();
            })
            .catch((error) => {
                console.log("Error creando tarea", error);
            });
    }

    const updateTask = async (task) => {
        await api.put(`/tasks/${taskId}`, task).then((response) => {
            onTaskUpdate();
            onClose();

        })
            .catch((error) => {
                console.log("Error actualizando tarea", error);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página
        if (taskId) {
            await updateTask(formTaskValues);
        } else {
            await createTask(formTaskValues); // Crea una nueva tarea si no existe `taskId`
        }
        setFormTaskValues(initialFormTaskValues);
        onTaskUpdate(); // Actualizar tareas
        onClose();


    };

    const getTaskInfo = async (id) => {
        await api.get(`/tasks/${id}`).then((response) => {
            setFormTaskValues(response.data.body);
        }).catch((error) => {
            console.error("Error fetching task:", error);
        })
    };


    useEffect(() => {
        if (taskId) {
            getTaskInfo(taskId);
        } else {
            setFormTaskValues(initialFormTaskValues);
        }
    }, []);


    return (
        <TaskContainer>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="title">
                        Titulo
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="Ingrese titulo"
                        value={formTaskValues.title}
                        onChange={handleTaskInputChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">
                        Descripcion
                    </Label>
                    <Input
                        id="description"
                        name="description"
                        type="textarea"
                        value={formTaskValues.description}
                        onChange={handleTaskInputChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="date">
                        Fecha Limite
                    </Label>
                    <Input
                        id="date"
                        name="date"
                        placeholder="dd/mm/aaaa"
                        type="date"
                        value={formTaskValues.date}
                        onChange={handleTaskInputChange}
                    />
                </FormGroup>
                <FormGroup row>
                    <Label
                        for="status"
                        sm={12}
                    >
                        Estado
                    </Label>
                    <Col md={12}>
                        <Input
                            id="status"
                            name="status"
                            type="select"
                            value={formTaskValues.status}
                            onChange={handleTaskInputChange}
                        >
                            <option>
                                Completada
                            </option>
                            <option>
                                Incompleta
                            </option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup
                    check
                    row
                >
                    <Col
                        lg={12}
                    >
                        <Button color='primary' type='submit'>
                            {taskId ? 'Actualizar Tarea' : 'Agregar Tarea'}
                        </Button>

                    </Col>
                </FormGroup>
            </Form>
        </TaskContainer>
    )
}

const TaskContainer = styled.div` 
    width: 90%;
    margin-top: 5%;
    margin-left: 5%;
`

export default Task