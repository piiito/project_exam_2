import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAPI from '../useApi';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Placeholder from '../images/user.png'
import DocumentMeta from 'react-document-meta';

const schema = yup
    .object({
        avatar: yup
            .string()
            .required('Please enter direct link to image')
            .matches(/(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg))/,
            'Make sure link ends with jpg/jpeg/gif/png/svg'),
    })
    .required();


export function UpdateAvatarPage(){
    const metatags = {
        title: 'Holidaze | Profile',
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
    const [imageURL, setImageURL] = useState(Placeholder);
    const name = params.name;


    function setNewProfileImage(value){

        if (value.match(/(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg))/)) {
            setImageURL(value);
        }
        if ((value === '' || !value.match(/(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg))/)) 
        && !(data.avatar === null || data.avatar === '')) {
        setImageURL(data.avatar);
    }

    if (!value.match(/(http)?s?:?(\/\/[^"']*\.(?:jpg|jpeg|gif|png|svg))/) && (data.avatar === null || data.avatar === '')){
        setImageURL(Placeholder);
    }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm({
        resolver: yupResolver(schema),
      });

      
    const { data, isLoading, isError } = useAPI('https://api.noroff.dev/api/v1/holidaze/profiles/' + userName, 'GET');

    useEffect(() => {
        
        if (data.avatar === null || data.avatar === ''){
            setImageURL(Placeholder);
        } else {
            setImageURL(data.avatar);
        }
    },[data.avatar]);
    console.log(data.avatar);

    const onSaveHandler = async(event) => {
        const url = 'https://api.noroff.dev/api/v1/holidaze/profiles/' + userName + '/media';
        const token = localStorage.getItem('Token');

        let newData = {
            avatar: event.avatar,
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(newData),

        };

        try{
            const response = await fetch(url, options);
            const json = await response.json();
            if(json.name){
                reset();
                window.location.reload();
               
            }
            if(json.errors){
                alert(json.errors[0].message);
            }
            }
            catch (error) {
                console.log(error);
             }
        };

        if (isLoading) {
            return (
                <div>Loading</div>
            );
            }
        if (isError){
            return <div>Error has occured, refresh please</div>

        }
        
        


    return (
     <>
        <DocumentMeta {...metatags}/>
        <main className='min-vh-100'>
            <div className='text-center col-6 mt-5 mb-5  mx-auto avatar-page'>
                <h1>Avatar</h1>
                <div style={{ width: '150px' }} className='text-center mx-auto d-block ' >
                    {data.avatar ? (
                    <img  style={{ width: '100%' }} class='image-fluid rounded-circle mx-auto d-block' src={data.avatar} alt='Profile'  onError={(event) => { if (event.target.src !== Placeholder) { event.target.onerror = null; event.target.src= Placeholder;}}}/>)
                    :
                    (<img  style={{ width: '100%' }} class='image-fluid rounded-circle mx-auto d-block' src={Placeholder} alt='Profile' ></img>)}
                </div>
                <form className='avatar-form'>
                    <div className='mb-3 input-group justify-content-center container-xl'>
                        <legend className='h5 pt-3'>Change avatar</legend>
                        <input className='form-control avatar-input' id='floatingInput' {...register('avatar')} onChange={(event) => setNewProfileImage(event.target.value)} placeholder='Please enter direct link to an image'></input>
                        <div> {errors.avatar?.message}</div>
                        <button type='submit' className='btn btn-primary' onClick={handleSubmit(onSaveHandler)}>Save</button>
                    </div>   
                </form>
            </div>
        </main>
     </>
    )
};