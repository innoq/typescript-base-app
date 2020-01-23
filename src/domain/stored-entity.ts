export interface StoredEntity {
    id: string;
}

export type Unstored<T extends StoredEntity> = Omit<T, 'id'>;