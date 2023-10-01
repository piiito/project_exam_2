import React from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAPI from '../useApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DocumentMeta from 'react-document-meta';

export const formatDate = (date) =>
  new Date(date).toLocaleString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) +
  ' at ' +
  new Date(date).toLocaleTimeString('en-ZA', {
    hour: 'numeric',
    minute: 'numeric',
  });

const schema = yup
    .object({
        dateArrival: yup
        .string()
        .matches(
            /(^0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4}$)/,
            'Must match date format'
        ),
        numberGuests: yup
        .number()
        .required('Please enter number of guests that will be staying')
        .min(1, 'Must be a minimum of 1'),
    })
    .required();



export function VenuePage(){
  const metatags = {
    title: 'Holidaze | Venue',
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


    let params = useParams();
    const navigate = useNavigate();
    const user = localStorage.getItem('Name');
    console.log(user);
    const date = new Date();
    const [arrivalDate, setArrivalDate] = useState(date);
    const [departureDate, setDepartureDate] = useState( new Date(arrivalDate.getTime() + 86400000));
    const { data, isLoading, hasError} = useAPI('https://api.noroff.dev/api/v1/holidaze/venues/'+params.id);
    const { register, handleSubmit, formState : { errors }, reset } = useForm({ resolver: yupResolver(schema),});
    const bookings = data.bookings;


    const getDaysArray = (bookings) => {
        if (!bookings || bookings.length === 0) {
          return [];
        }
      
        const bookedDates = [];
        bookings.forEach((booking) => {
          let currentDate = new Date(booking.dateFrom);
          const endDate = new Date(booking.dateTo);
      
          while (currentDate <= endDate) {
            getDaysArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
      
        return getDaysArray;
      };

    const onSubmitHandler = async (event) => {
        const url = 'https://api.noroff.dev/api/v1/holidaze/bookings';
        const token = localStorage.getItem('Token');

        let newData = {
            dateFrom: arrivalDate,
            dateTo: departureDate,
            guests: event.numberGuests,
            venueId: data.id,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newData),
        };

        try {
            const response = await fetch(url, options);
            const json = await response.json();
            if(json.id){
                reset();
                alert('Booking successfull!')
                navigate('/bookings');
            }
            if(json.errors){
                alert(json.errors[0].message);
            }
        } catch (error){
            console.log(error);
        }
    };

    if (isLoading){
        return <div>
            <h1>Venue</h1>
        </div>
    }

    if (hasError){
        return <div>
            <h1>Venue</h1>
            <p>Error! Please refresh!</p>
        </div>
    }

    const meta = data.meta;

    return (
    <>
      <DocumentMeta {...metatags}/>
      <main className='min-vh-100'>
        <div className='container my-5'>
          <div className='row venue-page'>
            <div className='col-md-12 col-lg-4 mb-4'>
              <img src={data.media} alt={data.name} className='img-fluid w-100 h-auto venue-page'/>
            </div>
            <div className='col-md-12 col-lg-8'>
              <h1 className='display-4 mb-4'>{data.name}</h1>
              {data.meta && (
                <div className='row mb-4'>
                  <div className='col-md-6'>
                    <ul className='list-unstyled meta-list'>
                      <li>
                        <strong>Price per night:</strong> ${data.price}
                      </li>
                      <li>
                        <strong>Max number of guests:</strong> {data.maxGuests}
                      </li>
                      <li>
                        <strong>Rating:</strong> {data.rating}/5
                      </li>
                      <li>
                        <strong>Location:</strong> {data.location.address}
                      </li>
                    </ul>
                  </div>
                  <div className='col-md-6'>
                    <ul className='list-unstyled meta-list'>
                      <li>
                        <strong>Wifi:</strong> {data.meta.wifi ? 'Yes' : 'No'}
                      </li>
                      <li>
                        <strong>Parking:</strong>{' '}
                        {data.meta.parking ? 'Yes' : 'No'}
                      </li>
                      <li>
                        <strong>Breakfast included:</strong>{' '}
                        {data.meta.breakfast ? 'Yes' : 'No'}
                      </li>
                      <li>
                        <strong>Pets allowed:</strong>{' '}
                        {data.meta.pets ? 'Yes' : 'No'}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
                <p className='lead row mb-4'>{data.description}</p>
              {user ? (
              <form onSubmit={handleSubmit(onSubmitHandler)} className='mb-4 book-form'>
                <div className='mb-3'>
                  <label htmlFor='dateArrival' className='form-label me-2'>
                    Date of Arrival
                  </label>
                  <DatePicker
                    id='dateArrival'
                    {...register('dateArrival')}
                    selected={arrivalDate}
                    onChange={(date) => setArrivalDate(date)}
                    className='form-control'
                    minDate={new Date()}
                    excludeDates={getDaysArray(bookings)}
                    dateFormat='dd/MM/yyyy'
                  />
                  <div className='text-danger'>{errors.dateArrival?.message}</div>
                </div>
                <div className='mb-3'>
                  <label htmlFor='dateDeparture' className='form-label me-2'>
                    Date of Departure
                  </label>
                  <DatePicker
                    id='dateDeparture'
                    {...register('dateDeparture')}
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    className='form-control'
                    minDate={new Date(arrivalDate.getTime() + 86400000)}
                    excludeDates={getDaysArray(bookings)}
                    dateFormat='dd/MM/yyyy'
                  />
                  <div className='text-danger'>{errors.dateDeparture?.message}</div>
                </div>
                <div style={{ width: '50%' }} className='mb-3'>
                  <label htmlFor='numberGuests' className='form-label'>
                    Number of Guests
                  </label>
                  <input
                    {...register('numberGuests')}
                    type='number'
                    className='form-control'
                    min='1'
                    max={data.maxGuests}
                    defaultValue='1'
                  />
                  <div className='text-danger'>{errors.numberGuests?.message}</div>
                </div>
                <button type='submit' className='btn btn-primary button-resize'>
                  Book Now
                </button>
              </form>
              ) : (
                <div className='alert alert-warning'>
                  Please <Link to='/login'>log in</Link> or{' '}
                  <Link to='/register'>register</Link> to book this venue.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};