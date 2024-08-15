import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface IUseFetch {
    errors?: unknown;
    isLoading?: boolean;
    data?: any;
}

interface IProps {
    url: string;
    method: "POST" | "GET" | "PATCH" | "PUT";
}

export const useFetch = ({ url, method }: IProps): IUseFetch => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<unknown>(null);
    const [errors, setErrors] = useState<unknown>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios({ method, url });
            setData(response.data);
        } catch (err) {
            setErrors(err);
        } finally {
            setIsLoading(false);
        }
    }, [method, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        isLoading,
        errors,
        data,
    };
};