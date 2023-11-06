import { useState } from "react";
const useError = () => {
    const [value, setValue] = useState('');


//set value for a temporary time 

    const set = (error: string) => {
        setValue(error)

        setTimeout(() =>
            setValue(''), 5000)
    }

    return {value,set};
}

export default useError