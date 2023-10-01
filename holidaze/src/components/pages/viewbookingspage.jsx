import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAPI from '../useApi';
import DocumentMeta from 'react-document-meta';

import { Routes, Route, Link, Outlet } from 'react-router-dom';


export function ViewBookingsPage() {
    const metatags = {
        title: 'Holidaze | View bookings',
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

      
    const params = useParams();
    const userName = localStorage.getItem('Name');
    const name = params.name;


    const { data, isLoading, isError } = useAPI('https://api.noroff.dev/api/v1/holidaze/profiles/'+userName+'?_bookings=true&_venues=true', 'GET');
    console.log(data)

   

    return (
     <>
        <DocumentMeta {...metatags}/>
        <main className='min-vh-100'>
            <div className='container mt-5'>
                <h1 className='text-center mb-4'>Your Bookings</h1>
                {data?.bookings?.length > 0 ? (
                    <div className='row row-cols-1 row-cols-md-2 g-4'>
                        {data.bookings.map(data => (
                            <div className='col' key={data.id}>
                                <div className='card h-100'>
                                    <div className='card-body'>
                                        <h5 className='card-title'>{data.venue.name} </h5>
                                        <img src={data.venue.media} className='card-img-top 'style={{ objectFit: 'cover', height: '200px' }} alt={data.venue.name}/>
                                        <p className='card-text mt-3'>Check-in: {data.dateFrom.slice(0, 10)} </p>
                                        <p className='card-text'>Check-out: {data.dateTo.slice(0,10)}</p>
                                        <p className='card-text'>Guests: {data.venue.maxGuests}</p>
                                        <p className='card-text'>Rating: {data.venue.rating}</p>
                                        <p className='card-text'>Address{ data.venue.location.address}, {data.venue.location.zip} {data.venue.location.city}, {data.venue.location.country}</p>
                                        <button className='btn btn-primary'>
                                            <Link to={'/venue/' + data.venue.id}>View Venue</Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center'>No bookings available</div>
                )}
            </div>
        </main>
     </>
    );
};
