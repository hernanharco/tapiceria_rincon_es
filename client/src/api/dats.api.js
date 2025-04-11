
import axios from 'axios'

const tasksApi = axios.create({
    //En esta parte tuvimos un error ya que se debe escribir bien el baseURL tener encuenta las mayusculas
    baseURL: "http://localhost:8000/dats_compa/api/v1/data_comp/"
})

//Consultar
//Consultar
export const getAllTasks = () => tasksApi.get('/')

//Consultar por id
export const getTask = (id) => tasksApi.get(`/${id}/`)

/*//Agregar
export const createTask = (dats) => {
    return tasksApi.post('/', dats)
}*/

//Eliminar
export const deleteTask = (id) => tasksApi.delete(`/${id}/`)

//Actualizar
export const updateTask = (id, dats) => tasksApi.put(`/${id}/`, dats)