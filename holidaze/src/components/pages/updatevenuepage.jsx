import React from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import useAPI from '../useApi';
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


export function UpdateVenuePage(){
    const metatags = {
        title: 'Holidaze | Update/delete venue',
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
    let params = useParams();
    const { data, isLoading, isError } = useAPI('https://api.noroff.dev/api/v1/holidaze/venues/' + params.id + '?_owner=true', 'GET');
    const { register: registerEdit, handleSubmit: handleEditSubmit, formState: {errors}, reset, } = useForm({ resolver: yupResolver(schema),});


    const onDeleteHandler = async(id) => {
        const url = `https://api.noroff.dev/api/v1/holidaze/venues/${params.id}`;
        const token = localStorage.getItem('Token');
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try{
            await fetch(url, options);
            alert('Venue successfully deleted')
            navigate('/');

        }catch (error){
            console.log(error);
        }
    };

    const onEditSubmithandler = async(event) => {
        const url = `https://api.noroff.dev/api/v1/holidaze/venues/${params.id}`;
        const token = localStorage.getItem('Token');

        let newData =  {
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
        
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newData)
        };


        try{
            const response = await fetch(url, options);
            const json = await response.json();

            if (json.name){
                alert('Updated successfully')
                navigate(`/venue/${params.id}`);
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
                        <h1>Update venue</h1>
                        <form onSubmit={handleEditSubmit(onEditSubmithandler)} className='mt-4'>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='name'>
                                    Venue name
                                </label>
                                <input className='form-control' defaultValue={data.name}{...registerEdit('name')}></input>
                                <div className='text-danger'>{errors.name?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='price'>
                                    Price
                                </label>
                                <input className='form-control' defaultValue={data.price} type='number' {...registerEdit('price')}></input>
                                <div className='text-danger'>{errors.number?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='maxGuests'>
                                    Max guests
                                </label>
                                <input className='form-control' defaultValue={data.maxGuests} {...registerEdit('maxGuests')}></input>
                                <div className='text-danger'>{errors.maxGuests?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label' htmlFor='media'>
                                    Direct image link
                                </label>
                                <input className='form-control' defaultValue={data.media || '' } {...registerEdit('media')}></input>
                                <div className='text-danger'>{errors.media?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-label ' htmlFor='description'>
                                    Description
                                </label>
                                <textarea className='form-control' defaultValue={data.description} {...registerEdit('description')}></textarea>
                                <div className='text-danger'>{errors.description?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='wifi'>
                                    Wifi
                                </label>
                                <input className='form-check-input' defaultChecked={data.meta?.wifi || '' } {...registerEdit('wifi')} type='checkbox'></input>
                                <div className='text-danger'>{errors.wifi?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='parking'>
                                    Parking
                                </label>
                                <input className='form-check-input' defaultChecked={data.meta?.parking || ''} {...registerEdit('parking')} type='checkbox'></input>
                                <div className='text-danger'>{errors.parking?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='pets'>
                                    Pets
                                </label>
                                <input className='form-check-input' defaultChecked={data.meta?.pets || ''} {...registerEdit('pets')} type='checkbox'></input>
                                <div className='text-danger'>{errors.pets?.message}</div>
                            </div>
                            <div className='mb-3 text-start'>
                                <label className='form-check-label me-3 ' htmlFor='breakfast'>
                                    Breakfast
                                </label>
                                <input className='form-check-input' defaultChecked={data.meta?.breakfast || ''} {...registerEdit('breakfast')} type='checkbox'></input>
                                <div className='text-danger'>{errors.breakfast?.message}</div>
                            </div>
                                <button className='btn btn-primary button-resize' type='submit'>
                                    Update venue
                                </button>
                                <button className='btn btn-secondary button-resize' type='button'  onClick={() => onDeleteHandler(params.id)}>
                                    Delete venue
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
     </>
    )
};
    
            
            
