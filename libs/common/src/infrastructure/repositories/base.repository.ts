import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

/**
 * A generic base repository class for managing entities in the database.
 * @typeparam Entity - The entity type this repository manages.
 */
@Injectable()
export abstract class BaseRepository<Entity extends ObjectLiteral> {
    /**
     * Creates an instance of the base repository.
     * @param entityRepository - The TypeORM repository for the entity.
     */
    constructor(private readonly entityRepository: Repository<Entity>) {}

    /**
     * Find an entity by its ID with specified relations and optional columns to select.
     * @param id - The ID of the entity to find.
     * @param relations - The relations to be eager-loaded.
     * @param columns - Optional array of column names to select.
     * @returns A promise that resolves to the found entity or null if not found.
     */
    async findByEntityId(id: number, relations: string[] = [], columns: string[] = []): Promise<Entity | null> {
        const queryBuilder = this.entityRepository.createQueryBuilder('entity');

        // Set the WHERE clause for the ID
        queryBuilder.where('entity.id = :id', { id });

        // Add relations if provided
        if (relations.length > 0) {
            relations.forEach((relation) => {
                queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
            });
        }

        // Add columns to select if provided
        if (columns.length > 0) {
            const columnAliases = columns.map((column) => `entity.${column}`);
            queryBuilder.select(columnAliases);
        }

        const entity = await queryBuilder.getOne();

        return entity || null;
    }

    /**
     * Find all entities with specified columns, relations, and filters.
     * @param columns - Optional array of column names to select.
     * @param relations - Optional array of relations to include.
     * @param filters - Optional object with filters for conditions.
     * @returns A promise that resolves to an array of entities.
     */
    async findAllEntities(columns?: string[], relations?: string[], filters?: Record<string, any>): Promise<Entity[]> {
        const queryBuilder = this.entityRepository.createQueryBuilder('entity'); // Change 'entity' to match your entity alias

        // Add columns to select if provided
        if (columns && columns.length > 0) {
            const columnAliases = columns.map((column) => `entity.${column}`);
            queryBuilder.select(columnAliases);
        }

        if (relations && relations.length > 0) {
            // Add the specified relations to the query
            for (const relation of relations) {
                queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
            }
        }

        // Add conditions based on filters, if provided
        if (filters) {
            for (const key of Object.keys(filters)) {
                // Generate the condition dynamically based on the filter property
                const condition = `entity.${key} = :${key}`;
                const parameters = { [key]: filters[key] };
                queryBuilder.andWhere(condition, parameters);
            }
        }

        // Execute the query and return the result
        const data = await queryBuilder.getMany();
        return data;
    }

    /**
      * Check the uniqueness of a field value in the database.
      * @param field The name of the field to check.
      * @param value The value to check for uniqueness.
      * @returns A boolean indicating whether the value is unique (true) or not (false).
      */
    async checkUniqueness(field: string, value: any): Promise<boolean> {
        // Implement the logic to check for uniqueness in your data source (e.g., database)
        // You can use an ORM or a database query here
        const existingEntity = await this.entityRepository.count({ where: { [field]: value } as FindOptionsWhere<Entity> });
        return !existingEntity; // Return true if the value is unique, false otherwise
    }
}
