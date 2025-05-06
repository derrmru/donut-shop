import { useEffect, useState } from 'react';
import { isNotNull, type Nullable } from '../common/utils';

export type Donut = {
    id: number;
    name: string;
    price: number;
    imageName: string;
}

export function validateDonut(donut: any): donut is Donut {
    return (
        typeof donut.id === 'number' &&
        typeof donut.name === 'string' &&
        typeof donut.price === 'number' &&
        typeof donut.imageName === 'string'
    );
}

export function randomise<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export function useGetDonuts(retry: number) {

    //normally I would use a lib like react query or rtk query for this
    //but for the sake of simplicity, I will use a custom hook
    //and fetch the data from a local json file

    const [donuts, setDonuts] = useState<Donut[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Nullable<string>>(null);

    useEffect(() => {
        const fetchDonuts = async () => {
            try {
                setLoading(true)
                if (isNotNull(error)) setError(null)
                const response = await fetch('/donuts.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // if a particular donut is invalid we don't block the application, we will log it, filter it and continue
                const validDonuts = data.filter((item: unknown) => {
                    const isValid = validateDonut(item);
                    if (!isValid) {
                        console.error('Invalid donut data:', item);
                    }
                    return isValid;
                });

                setDonuts(randomise<Donut>(validDonuts));
            } catch (error) {
                setError('Error fetching donuts');
                console.error('Error fetching donuts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonuts();
    }, [retry]);

    return {
        donuts,
        loading,
        error,
    }
}