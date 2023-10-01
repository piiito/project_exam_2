import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate , Link } from 'react-router-dom';
import * as yup from 'yup';
import DocumentMeta from 'react-document-meta';

const schema = yup
    .object({
        name: yup
            .string()
            .required('Please create a username')
            .typeError('Username must not include symbols apart from underscore'),
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
        retypePassword: yup
            .string()
            .required('Please retype password')
            .oneOf([yup.ref('password')], 'Passwords does not match'),
        venueManager: yup
            .boolean()
    })
    .required();



export function RegisterPage(){
    const metatags = {
        title: 'Holidaze | Register',
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
      
    const url = 'https://api.noroff.dev/api/v1/holidaze/auth/register';
    const navigate = useNavigate();
    const { register, handleSubmit, formState : { errors }, reset } = useForm({ resolver: yupResolver(schema),});

    const meta = {
        title: 'Holidaze | Register',
        description: 'Holidaze is a booking site - fill this in later - OBS!',
        meta: {
            charset: 'utf-8',
            name: {
                keywords: 'holidaze, venues, hotels, holiday, vacation',

            },
        },
    }

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
                if (json.id){
                    reset();
                    navigate('/login');
                }
                if(json.errors){
                    alert(json.errors[0].message);
                }}
                catch (error){
                    console.log(error);
                }
            };
            postData(data);
        }



    return (
     <>
        <DocumentMeta {...metatags}/>
        <main className='min-vh-100'>
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6 text-center'>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit(onSubmitHandler)} className='mt-4 register-form'>
                            <div className='mb-3 text-start'>
                                <label htmlFor='name' className='form-label'>
                                    Username
                                </label>
                                <input {...register('name')} className='form-control'/>
                                <p className='text-danger'>{errors.name?.message}</p>
                            </div>
                            <div className='mb-3 text-start'>
                                <label htmlFor='email' className='form-label'>
                                    Email
                                </label>
                                <input {...register('email')} className='form-control'/>
                                <p className='text-danger'>{errors.email?.message}</p>
                            </div>
                            <div className='mb-3 text-start'>
                                <label htmlFor='password' className='form-label'>
                                    Password
                                </label>
                                <input {...register('password')} className='form-control'/>
                                <p className='text-danger'>{errors.password?.message}</p>
                            </div>
                            <div className='mb-3 text-start'>
                                <label htmlFor='retypePassword' className='form-label'
                                >Confirm assword
                            </label>
                                <input {...register('retypePassword')} className='form-control'/>
                                <p className='text-danger'>{errors.retypePassword?.message}</p>
                            </div>
                            <div className='text-start'>
                                <label htmlFor='venueManager' className='form-check-label me-3 '>
                                    Register as venue manager
                                </label>
                                <input type='checkbox'  {...register('venueManager')} className='form-check-input'/>
                                <p className='text-danger'>{errors.venueManager?.message}</p>
                            </div>
                            <button className='btn btn-primary button-resize' type='submit'>
                                Register 
                            </button>
                        </form>
                        <div className='mt-3'>
                            <p>Already have an account? <Link to='/login'>Log in here</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
     </>
    )
}

