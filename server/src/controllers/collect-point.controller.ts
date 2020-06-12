import { Request, Response } from 'express';
import knex from '../database/connection';


class CollectPointController {
    async getAll(request: Request, response: Response) {
        const collectPoints = await knex('collectPoints').select('*');
        
        const items = await knex('items')
            .innerJoin('collectPointItemRelations', 'collectPointItemRelations.itemId', 'items.itemId')
            .innerJoin('collectPoints', 'collectPoints.collectPointId',  'collectPointItemRelations.collectPointId')
            .select('collectPoints.collectPointId', 'items.itemId', 'items.title', 'items.image');
        
        const serializedCollectPoints = collectPoints.map(collectPoint => {

            collectPoint.items = items.filter(
                item => item.collectPointId == collectPoint.collectPointId
            ).map(item => {
                return {
                    itemId: item.itemId,
                    title: item.title,
                    image: item.image
                }
            });

            return collectPoint;
        });

        return response.json(serializedCollectPoints);
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;
        const collectPoint = await knex('collectPoints')
            .where('collectPointId', id)
            .first();
    
        if(!collectPoint){
            return response.status(400).json({ message: 'Point not found.' });
        }

        const items = await knex('items')
            .innerJoin('collectPointItemRelations', 'collectPointItemRelations.itemId', 'items.itemId')
            .where('collectPointItemRelations.collectPointId', id)
            .select('items.itemId', 'items.title', 'items.image');

        const serializedCollectPoint = collectPoint;
        serializedCollectPoint.items = items;
    
        return response.json(serializedCollectPoint);
    }

    async get(request: Request, response: Response) {
        const { city, zipcode, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const collectPoints = await knex('collectPoints')
            .innerJoin('collectPointItemRelations', 'collectPointItemRelations.collectPointId', 'collectPoints.collectPointId')
            .whereIn('collectPointItemRelations.itemId', parsedItems)
            .where('collectPoints.city', String(city))
            .where('collectPoints.zipcode', String(zipcode))
            .distinct()
            .select('collectPoints.*')
        
        const items2 = await knex('items')
            .innerJoin('collectPointItemRelations', 'collectPointItemRelations.itemId', 'items.itemId')
            .innerJoin('collectPoints', 'collectPoints.collectPointId',  'collectPointItemRelations.collectPointId')
            .select('collectPoints.collectPointId', 'items.itemId', 'items.title', 'items.image')
            .whereIn('collectPoints.collectPointId', collectPoints.map(collectPoint => Number(collectPoint.collectPointId)));
        
        const serializedCollectPoints = collectPoints.map(collectPoint => {

            collectPoint.items = items2.filter(
                item => item.collectPointId == collectPoint.collectPointId
            ).map(item => {
                return {
                    itemId: item.itemId,
                    title: item.title,
                    image: item.image
                }
            });

            return collectPoint;
        });

        return response.json(serializedCollectPoints);
    }

    async create(request: Request, response: Response) {
        const { name, image, email, whatsapp, latitude, longitude, city, zipcode, items } = request.body;
    
        const trx = await knex.transaction();

        const collectPoint = {
            name: name,
            image: image,
            email: email,
            whatsapp: whatsapp,
            latitude: latitude,
            longitude: longitude,
            city: city,
            zipcode: zipcode,
        };
    
        const collectPointIds = await trx('collectPoints').insert(collectPoint);
        const collectPointId = collectPointIds[0];
        const collectPointItemRelations = items.map((itemId: number) => {
            return {
                itemId: itemId,
                collectPointId: collectPointId
            };
        });
    
        await trx('collectPointItemRelations').insert(collectPointItemRelations);

        await trx.commit()
    
        return response.json({
            collectPointId: collectPointId,
            ...collectPoint
        });
    }
}

export default CollectPointController;