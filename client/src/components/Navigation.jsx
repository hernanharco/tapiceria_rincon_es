
import { Link } from 'react-router-dom'
import { Dat_Company } from './dat_company'

export function Navigation() {
    return (
        <div className='flex justify-between py-3'>
            <Link to="/tasks">
                <h1 className='font-bold text-3xl mb-4'><Dat_Company /></h1>
            </Link>
        </div>
    )
}

/*<button className='bg-indigo-500 px-3 py-2 rounded-lg'>
                <Link to="/tasks-create">create task</Link>
            </button>*/