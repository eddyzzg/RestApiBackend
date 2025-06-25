import mongoose, { Document, Schema } from 'mongoose';

// Definiowanie interfejsu dla dokumentu przedmiotu z MongoDB (POJO !!!!)
export interface MongoSubjectObject {
    id: number;
    label: string;
    value: any;
    isFromLoggedUser: boolean;
}

export interface MongoSubjectDocument extends Omit<Document, 'id'>, MongoSubjectObject {
    // Tutaj możesz dodać metody instancji Mongoose, jeśli chcesz je typować
    // np. someInstanceMethod(): string;
}

const MongoSubjectSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true }, // unikalne
    label: { type: String, required: true },
    value: { type: String, required: true, unique: false },
    isFromLoggedUser: { type: Boolean, required: true, default: true },
}, {
    id: false,
    versionKey: false
});

export const MongoSubject = mongoose.model<MongoSubjectDocument>('MongoSubject', MongoSubjectSchema); // Eksportujemy model

/**
 * Pobiera wszystkie rekordy z kolekcji 'MongoSubject'.
 * Jest to abstrakcja dostępu do danych dla MongoDB.
 *
 * @returns {Promise<MongoSubject[]>} Promise z listą dokumentów MongoDB.
 */
export async function getAllMongoSubjects(): Promise<MongoSubjectObject[]> {
    try {
        const results = await MongoSubject.find({}).lean().exec();
        return results as MongoSubjectObject[];
    } catch (err: unknown) {
        console.error('Error in MongoSubjectModel.getAllMongoSubjects:', err);
        throw err;
    }
}

export async function initMongoDB(): Promise<void> {
    try {
        const count = await MongoSubject.countDocuments();
        if (count === 0) {
            console.log('MongoDB collection "mongosubjects" is empty. Seeding initial data...');
            const initialSubject = new MongoSubject({
                id: 999, // Unikalne ID dla początkowego rekordu
                label: "hr",
                value: "Dział HR",
                isFromLoggedUser: true
            });
            await initialSubject.save();
            console.log('Initial MongoSubject added.');
        } else {
            console.log(`MongoDB collection "mongosubjects" already contains ${count} documents. Skipping seeding.`);
        }
    } catch (err: unknown) {
        console.log('Error ensuring MongoDB initial data:', err);
    }
}