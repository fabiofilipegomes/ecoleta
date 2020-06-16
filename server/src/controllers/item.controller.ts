import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemController {
    async getAll(request: Request, response: Response) {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                itemId: item.itemId,
                title: item.title,
                image_url: `http://192.168.0.25:3333/assets/${item.image}`
            };
        });
    
        return response.json(serializedItems);
    }
}

export default ItemController;