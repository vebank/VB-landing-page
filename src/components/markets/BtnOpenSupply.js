import { useState ,useEffect} from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';

const BtnOpenSupply = ({ item }) => {

    const [disabledRule, setDisabledRule] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // env stag
        if(process.env.REACT_APP_ENV === 'staging' && item.assetsAddress === process.env.REACT_APP_TOKEN_VTHO){
            setDisabledRule(true)
        }
    }, []);

    const handlerOpenModal = async () => {
        if (item && item.assetsAddress) {
            dispatch(actions.loadModalSupply(item))
        }
    }



    return (<>

        {
            disabledRule ? <button className="btn-veb h-10 bg-btn-veb-disabled border-[1px] border-[#4B5C86]" disabled={disabledRule} type="submit">Supply </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">Supply </button>
        }

    </>)
}

export default BtnOpenSupply;