

import { useState, useEffect, createContext } from "react";
import axios from 'axios'

const DataCompanyContext = createContext();

const DataCompanyProvider = ({ children }) => {

    const [bebidas, setBebidas] = useState([])
    const [modal, setModal] = useState(false);
    const [bebidaId, setBebidaId] = useState(null)
    const [receta, setReceta] = useState({})
    const [cargando, setCargando] = useState(false);

    const consultarBebida = async datos => {
        try {
            const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${datos.nombre}&c=${datos.categoria}`;

            // console.log(url);

            const { data } = await axios(url);
            // console.log(data.drinks);

            setBebidas(data.drinks);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        setCargando(true);

        const obtenerRecerta = async () => {
            if (!bebidaId) return

            try {
                const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${bebidaId}`;
                // console.log(url);

                const { data } = await axios(url)
                // console.log(data.drinks[0]);
                setReceta(data.drinks[0]);

            } catch (error) {
                console.log(error);
            } finally {
                setCargando(false);
            }
        }

        obtenerRecerta();

    }, [bebidaId])


    const handleModalClick = () => {
        setModal(!modal);
    }

    const handleBebidaIdClick = id => {
        setBebidaId(id);
    }

    return (
        <BebidasContext.Provider
            value={{
                consultarBebida,
                bebidas,
                handleModalClick,
                modal,
                handleBebidaIdClick,
                receta,
                setReceta,
                cargando
            }}
        >
            {children}
        </BebidasContext.Provider>
    )
}

export {
    DataCompanyProvider
}

export default DataCompanyContext;