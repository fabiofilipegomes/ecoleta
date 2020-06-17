import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import DropZone from '../../components/dropzone';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';

interface Item {
    itemId: number;
    title: string;
    image_url: string;
}

interface CollectPoint {
    name: string;
    email: string;
    whatsapp: string;
    image: File;
    latitude: number;
    longitude: number;
    city: string;
    zipcode: string;
    items: number[]
}

const CreateCollectPoint = () => {
    const history = useHistory();
    const [items, setItems] = useState<Item[]>([]);
    const [zoom, setZoom] = useState<number>(15);

    const [collectPointToCreate, setCollectPointToCreate] = useState<CollectPoint>(emptyCollectPoint());
    const [selectedFile, setSelectedFile] = useState<File>();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setCollectPointToCreate({
                ...collectPointToCreate, 
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }, []);
    
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        setCollectPointToCreate({
            ...collectPointToCreate,
            image: selectedFile ? selectedFile : {} as File
        });
    }, [selectedFile]);

    function emptyCollectPoint(): CollectPoint{
        return ({name: '',
            email: '',
            whatsapp: '',
            image: {} as File,
            latitude: 41.1399589,
            longitude: -8.6116372,
            city: '',
            zipcode: '',
            items: []
        });
    }

    function handleMapClick(event: LeafletMouseEvent){
        setCollectPointToCreate({
            ...collectPointToCreate, 
            latitude: event.latlng.lat,
            longitude: event.latlng.lng
        });
    }

    function handleMapZoom(event: LeafletMouseEvent){
        setZoom(event.target._zoom);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setCollectPointToCreate({
            ...collectPointToCreate, 
            [name]: value
        });
    }

    function handleSelectItem(item: number){
        var itemExists = collectPointToCreate.items.some(selectedItem => selectedItem == item);
        if(itemExists){
            const filteredItems = collectPointToCreate.items.filter(selectedItem => selectedItem != item);
            setCollectPointToCreate({
                ...collectPointToCreate, 
                items: filteredItems
            });
        }else{
            setCollectPointToCreate({
                ...collectPointToCreate, 
                items: [...collectPointToCreate.items, item]
            });

        }
    }

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        const data = new FormData();
        data.append('name', collectPointToCreate.name);
        data.append('email', collectPointToCreate.email);
        data.append('whatsapp', collectPointToCreate.whatsapp);
        data.append('latitude', String(collectPointToCreate.latitude));
        data.append('longitude', String(collectPointToCreate.longitude));
        data.append('city', collectPointToCreate.city);
        data.append('zipcode', collectPointToCreate.zipcode);
        data.append('items', collectPointToCreate.items.join(','));
        if(collectPointToCreate.image) data.append('image', collectPointToCreate.image);

        api.post('collectPoints', data).then(response => {
            alert('Ponto de coleta criado com sucesso!');
            setCollectPointToCreate(emptyCollectPoint());
            history.push('/');
        });
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecolata"/>

                <Link to="/">
                    <span>
                        <FiArrowLeft />
                    </span>
                    Voltar
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Registar <br/> ponto de coleta</h1>

                <DropZone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input id="name" name="name" type="text" onChange={handleInputChange} />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input id="email" name="email" type="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input id="whatsapp" name="whatsapp" type="text" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[collectPointToCreate.latitude, collectPointToCreate.longitude]} zoom={zoom} onclick={handleMapClick} onzoomend={handleMapZoom}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[collectPointToCreate.latitude, collectPointToCreate.longitude]}></Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="zipcode">Cod. Postal</label>
                            <input id="zipcode" name="zipcode" type="text" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <input id="city" name="city" type="text" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item =>{
                            return (
                                <li className={collectPointToCreate.items.filter(selectedItem => selectedItem == item.itemId).length > 0 ? 'selected' : ''}
                                    key={item.itemId} onClick={() => handleSelectItem(item.itemId)}>
                                    <img src={item.image_url} alt={item.title}/>
                                    <span>{item.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </fieldset>

                <button type="submit">Registar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreateCollectPoint;