import { Identifiable } from './identifiable';

export const isIdentifiable = (obj: any): obj is Identifiable => obj instanceof Object
    && (obj.id instanceof String || typeof obj.id === 'string');

