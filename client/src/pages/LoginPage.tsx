import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, FieldProps } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import Cookies from "js-cookie";

interface FormValues {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [data, setData] = useState<any>();
    const [responseErrors, setResponseErrors] = useState<AxiosError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    const navigate = useNavigate();

    const initialValues: FormValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values: FormValues) => {
        setResponseErrors(null);
        setIsLoading(true);
        setIsLoading(false);
        try {
            const response = await axios.post("http://localhost:8080/auth/signin", values);
            console.log(responseErrors);
            
            navigate("/auth/sign-in")
            setData(response.data);
            
            Cookies.set('access_token', response.data.access_token)
            navigate("/")
        } catch (error) {
            if (error instanceof AxiosError) {
                setResponseErrors(error)
                console.log(error);
            }
        } finally {
            setIsLoading(true);
        }
    };

    return (
        <div className='flex flex-col gap-5 mt-10 max-w-[500px] w-full mx-auto'>
            <h1 className='text-3xl font-bold text-center'>
                Sign <span className='text-red-600 font-extrabold'>In</span>
            </h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isValid, dirty, errors, touched, values }) => (
                    <Form className='flex flex-col gap-3'>
                        <div className='mb-4'>
                            <Field name='email'>
                                {({ field }: FieldProps) => (
                                    <div>
                                        <Input
                                            {...field}
                                            placeholder='Enter your email'
                                            size='lg'
                                            isInvalid={!!(errors.email && touched.email)}
                                            errorMessage={errors.email}
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div className='mb-4'>
                            <Field name='password'>
                                {({ field }: FieldProps) => (
                                    <div>
                                        <Input
                                            {...field}
                                            placeholder='Enter your password'
                                            type='password'
                                            size='lg'
                                            isInvalid={!!(errors.password && touched.password)}
                                            errorMessage={errors.password}
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        {
                            isLoading ? (
                                responseErrors ? (
                                    <div className='p-3 bg-danger-100 rounded-2xl text-danger text-center'>
                                        <p>{responseErrors?.response?.status === 403 ? <span>This email {values.email} doesn't exist</span> : responseErrors?.response?.statusText}</p>
                                    </div>
                                ) : data ? (
                                    <div className='p-3 bg-success-100 rounded-2xl text-success text-center'>
                                        <p>You successfully logged in <Link to={"/auth/sign-in"}>Refresh Page</Link></p>
                                    </div>
                                ) : ""
                            ) : ""
                        }

                        <Button
                            type='submit'
                            color='success'
                            variant='flat'
                            isDisabled={!isValid || !dirty}
                            size='lg'
                        >
                            Sign In
                        </Button>

                        <p className='text-center'>
                            If you don't have an account? <Link className='text-success' to={"/auth/sign-up"}>Getting started</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginPage;
