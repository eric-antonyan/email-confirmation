import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';

interface FormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    const [confirmPasswordIsHidden, setConfirmPasswordIsHidden] = useState(true);
    const [data, setData] = useState<any>("")
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<AxiosError | null>(null);

    const navigate = useNavigate()

    const togglePassword = () => {
        setPasswordIsHidden(prev => !prev);
    };

    const toggleConfirmPassword = () => {
        setConfirmPasswordIsHidden(prev => !prev);
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ""], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const initialValues: FormValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values: FormValues) => {
        setErrors(null);
        setIsLoading(true);
        setIsLoading(false);
        try {
            const response = await axios.post("http://localhost:8080/auth/signup", values);
            navigate("/")
            setData(response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrors(error)
                console.log(error);
            }
        } finally {
            setIsLoading(true);
        }
    };

    return (
        <div className='flex flex-col gap-5 mt-10 max-w-[500px] w-full mx-auto'>
            <h1 className='text-3xl font-bold text-center'>
                Getting <span className='text-red-600 font-extrabold'>Started</span>
            </h1>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isValid, dirty, isSubmitting, values }) => (
                    <Form className='flex flex-col gap-3'>
                        <div>
                            <Field name='email'>
                                {({ field }: { field: any }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            placeholder='Enter your email'
                                            size='lg'
                                            isInvalid={!!field.error}
                                        />
                                        <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div>
                            <Field name='password'>
                                {({ field }: { field: any }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type={passwordIsHidden ? 'password' : 'text'}
                                            placeholder='Enter your password'
                                            size='lg'
                                            endContent={
                                                <div
                                                    onClick={togglePassword}
                                                    className='cursor-pointer'
                                                >
                                                    {passwordIsHidden ? <FaEye /> : <FaEyeSlash />}
                                                </div>
                                            }
                                        />
                                        <ErrorMessage name='password' component='div' className='text-red-500 text-sm mt-1' />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div>
                            <Field name='confirmPassword'>
                                {({ field }: { field: any }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type={confirmPasswordIsHidden ? 'password' : 'text'}
                                            placeholder='Confirm password'
                                            size='lg'
                                            endContent={
                                                <div
                                                    onClick={toggleConfirmPassword}
                                                    className='cursor-pointer'
                                                >
                                                    {confirmPasswordIsHidden ? <FaEye /> : <FaEyeSlash />}
                                                </div>
                                            }
                                        />
                                        <ErrorMessage name='confirmPassword' component='div' className='text-red-500 text-sm mt-1' />
                                    </div>
                                )}
                            </Field>
                        </div>

                        {
                            !isLoading ? (
                                errors ? (
                                    <div className='p-3 bg-danger-100 rounded-2xl text-danger text-center'>
                                        <p>{errors.response?.status === 409 ? <span>This email {values.email} is exist</span> : errors.response?.statusText}</p>
                                    </div>
                                ) : ""
                            ) : data.id ? (
                                <div className='p-3 bg-success-100 rounded-2xl text-success'>
                                    <p>You successfully registered <Link to={"/auth/sign-in"}>Login</Link></p>
                                </div>
                            ) : ""
                        }

                        <Button type='submit' isDisabled={!isValid || !dirty || isSubmitting || !isLoading} color='success' variant='flat' size='lg'>
                            Sign Up
                        </Button>

                        <p className='text-center'>
                            Have you an account? <Link className='text-success' to={"/auth/sign-in"}>Sign In</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterPage;
