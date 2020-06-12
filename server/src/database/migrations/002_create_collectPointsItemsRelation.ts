import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('collectPointItemRelations', table => {
        table.increments('collectPointItemRelationId').primary;
        table.integer('collectPointId')
            .notNullable()
            .references('collectPointId')
            .inTable('collectPoints');
        table.integer('itemId')
            .notNullable()
            .references('itemId')
            .inTable('items');
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('collectPointItemRelations');
}