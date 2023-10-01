import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DocumentMeta from 'react-document-meta';


const schema = yup
    .object()
    .shape(
        {
            name: yup
            .string()
            .required('Please enter venue name')
            .typeError('Please enter venue name')
            .min(3, 'Venue name must contain a minimum of 3 characters'),
            description: yup
            .string()
            .required('Please enter a description')
            .typeError('Please enter a description')
            .min(20, 'Description must contain a minimum of 20 characters')
            .max(2500, ' Max 2500 characters'),
            media: yup.string().when('media', {
                is: null || '',
                then: () => yup.string().nullable(),
                otherwise: () =>
                    yup
                    .string()
                    .matches(
                    /(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg))/,
                    'Must be a direct image link'
                    ),
             }),
            price: yup
            .number()
            .typeError('Please enter price per night')
            .required('Please enter price per night')
            .min(1, 'Minimum price is 1 kr'),
            maxGuests: yup
            .number()
            .typeError('Please enter max amount of guests')
            .required('Please enter max amount of guests')
            .min(1, 'Minimum 1 guest')
            .max(100, 'Maximum 100 guests'),
            wifi: yup.boolean(),
            parking: yup.boolean(),
            breakfast: yup.boolean(),
            pets: yup.boolean(),
        },
        [['media', 'media']]
    )
    .required();





export function CreateVenuePage(){

    const metatags = {
        title: 'Holidaze | Create venue',
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

    const navigate = useNavigate();
    const { register, handleSubmit, formState: {errors}, reset, } = useForm({ resolver: yupResolver(schema),});


    const onSubmithandler = async(event) => {

        const url = 'https://api.noroff.dev/api/v1/holidaze/venues';
        const token = localStorage.getItem('Token');

        let newData = {};

        if (event.media !== '' ){
            newData = {
                name: event.name,
                description: event.description,
                media: [event.media],
                price: event.price,
                maxGuests: event.maxGuests,
                meta: {
                    wifi: event.wifi,
                    parking: event.parking,
                    breakfast: event.breakfast,
                    pets: event.pets,
                },
            };
        }
        else {
            newData = {
                name: event.name,
                description: event.description,
                price: event.price,
                maxGuests: event.maxGuests,
                meta: {
                    wifi: event.wifi,
                    parking: event.parking,
                    breakfast: event.breakfast,
                    pets: event.pets,
                },
            };
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newData)
        };


        try{
            const response = await fetch(url, options);
            const json = await response.json();

            if (json.id){
                reset();
                alert('Venue successfully posted!')
                navigate(`/venue/${json.id}`);
            }
            else{
                alert(json.errors[0].message);
            }
            }catch (error) {
                console.log(error);
            }
        }


    
    return ( 
     <>
        <DocumentMeta {...metatags}/>
        <main className='min-vh-100'>
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6 text-center'>
                        <h1>Create new venue</h1>
                        <form onSubmit={handleSubmit(onSubmithandler)} className='mt-4'>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='name'>
                                    Venue name
                                </label>
                                <input className='form-control' {...register('name')}></input>
                                <div className='text-danger'>{errors.name?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='price'>
                                    Price
                                </label>
                                <input className='form-control' type='number' {...register('price')}></input>
                                <div className='text-danger'>{errors.number?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='maxGuests'>
                                    Max guests
                                </label>
                                <input className='form-control' {...register('maxGuests')}></input>
                                <div className='text-danger'>{errors.maxGuests?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='media'>
                                    Direct image link
                                </label>
                                <input className='form-control' {...register('media')}></input>
                                <div className='text-danger'>{errors.media?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label ' htmlFor='description'>
                                    Description
                                </label>
                                <textarea className='form-control' {...register('description')}></textarea>
                                <div className='text-danger'>{errors.description?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='wifi'>
                                    Wifi
                                </label>
                                <input className='form-check-input' {...register('wifi')} type='checkbox'></input>
                                <div className='text-danger'>{errors.wifi?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='parking'>
                                    Parking
                                </label>
                                <input className='form-check-input' {...register('parking')} type='checkbox'></input>
                                <div className='text-danger'>{errors.parking?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='pets'>
                                    Pets
                                </label>
                                <input className='form-check-input' {...register('pets')} type='checkbox'></input>
                                <div className='text-danger'>{errors.pets?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='breakfast'>
                                    Breakfast
                                    </label>
                                <input className='form-check-input' {...register('breakfast')} type='checkbox'></input>
                                <div className='text-danger'>{errors.breakfast?.message}</div>
                            </div>
                                <button className='btn btn-primary button-resize' type='submit'>
                                    Post venue
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        </>
    )
};


