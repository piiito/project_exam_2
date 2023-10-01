import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import DocumentMeta from 'react-document-meta';

const schema = yup
    .object({
        email: yup
            .string()
            .required('Please enter your noroff email adress')
            .matches(/^(?:(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-._+])*@(?:noroff\.no|stud\.noroff\.no))$/,
                'Please enter a valid noroff.no or stud.noroff.no email address'),
        password: yup
            .string()
            .min(8, 'Must contain min 8 characters')
            .required('Please fill inn password')
            .typeError('Please fill inn password'),
    })
    .required();



export function LoginPage(){

  const metatags = {
    title: 'Holidaze | Log in',
    description:
      'Welcome to Holidaze, your ultimate travel companion. We are all about making it easy to find the perfect place to stay, so you can focus on having the adventure of a lifetime.',
    meta: {
      charset: 'utf-8',
      name: {
        keywords:
          'holidaze, venues, accommodation, , holiday, booking, vacay, vacation, living, hotel',
      },
    },
  };


    const url = 'https://api.noroff.dev/api/v1/holidaze/auth/login';
    const navigate = useNavigate();
    const { register, handleSubmit, formState : { errors }, reset } = useForm({ resolver: yupResolver(schema),});

    const onSubmitHandler = (data) => {
        const postData = async (data) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };

            try {
                const response = await fetch(url, options);
                const json = await response.json();
                if (json.accessToken){
                    localStorage.setItem('Token', json.accessToken);
                    localStorage.setItem('Name', json.name);
                    localStorage.setItem('Manager', json.venueManager);
                    reset();
                    alert('Successfully logged in');
                    navigate('/');
                }
                if(json.errors){
                    alert(json.errors[0].message);
                }}
                catch (error){
                    console.log(error);
                }
            };
            postData(data);
        };


    

    return (
      <>
        <DocumentMeta {...metatags}/>
        <main className='min-vh-100'>
          <div className='container mt-5'>
            <div className='row justify-content-center'>
              <div className='col-md-6 text-center'>
                <h1>Log in</h1>
                <form onSubmit={handleSubmit(onSubmitHandler)} className='mt-4'>
                  <div className='mb-3 text-start'>
                    <label htmlFor='email' className='form-label'>
                      Email
                    </label>
                    <input {...register('email')} className='form-control' />
                    <p className='text-danger'>{errors.email?.message}</p>
                  </div>
                  <div className='mb-3 text-start'>
                    <label htmlFor='password' className='form-label'>
                      Password
                    </label>
                    <input {...register('password')} type='password' className='form-control' />
                    <p className='text-danger'>{errors.password?.message}</p>
                  </div>
                  <button type='submit' className='btn btn-primary button-resize'>
                    Log In
                  </button>
                </form>
                <div className='mt-3'>
                  <p>Don't have an account? <Link to='/register'>Register here</Link>.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
};