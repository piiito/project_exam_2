import { useState, useEffect } from 'react';

export default function useAPI(url, method, info) {
    const [data, setData] = useState([]);
    const [ isLoading, setIsLoading] = useState(false);
    const [ hasError, setHasError] = useState(false);

    useEffect(() => {
        async function getData() {
            try{
                setIsLoading(true);
                setHasError(false);

                const token = localStorage.getItem('Token');
                const options = {
                    method: method,
                    headers : {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(info),
                };

                const fetchedData = await fetch(url, options);
                const json = await fetchedData.json();
                setData(json);

            } catch (error){
                console.log(error);
                setHasError(true);

            } finally {
                setIsLoading(false);
            }
        }

        getData();
    }, [url, method, info]);
    return { data, isLoading, hasError };
}