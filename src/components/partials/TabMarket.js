import { NavLink } from 'react-router-dom';

const TabMarket = () => {
    return (
        <div className='flex flex-col-reverse items-center flex-initial w-3/5'>
            <div className="tab-market">
                <NavLink to="/supply" >
                    Supply
                </NavLink>
                <NavLink to="/borrows" >
                    Borrows
                </NavLink>
            </div>
        </div>
    )
}

export default TabMarket;