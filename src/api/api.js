import React from 'react'
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Cambia la URL según tu configuración
});

export default api;
