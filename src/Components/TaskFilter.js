import React from 'react'
import styled from 'styled-components'
import { FormGroup, Input, Label } from 'reactstrap'

function TaskFilter({ setFilter, setSortOption }) {
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <ContainerTaskFilter>
            <FormGroup>
                <Label for="state-filter">
                    Filtrar por estado:
                </Label>
                <Input
                    id="state-filter"
                    name="state-filter"
                    type="select"
                    onChange={handleFilterChange}
                >
                    <option value="todas">Todas</option>
                    <option value="completada">Completada</option>
                    <option value="incompleta">Incompleta</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="order">
                    Ordenar por:
                </Label>
                <Input
                    id="order"
                    name="order"
                    type="select"
                    onChange={handleSortChange}
                >
                    <option value="fecha">Fecha Limite</option>
                    <option value="titulo">Titulo</option>
                    <option value="estado">Estado</option>
                </Input>
            </FormGroup>
        </ContainerTaskFilter>
    )
}

const ContainerTaskFilter = styled.div`
    display: flex;
    flex-direction: row;
    width: 80%;
    margin-left: 10%;
`

export default TaskFilter