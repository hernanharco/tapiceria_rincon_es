
import { useContext } from "react";
import DataCompanyContext from "../context/DataCompanyProvider";

const useDataCompany = () => {
    return useContext(DataCompanyContext)
}

export default useDataCompany;