import { getAll as getAllSubjectsFromSql } from '../models/subjectModel';
import { Subject as SqlSubject } from '../models/subjectModel';

import { getAllMongoSubjects, MongoSubjectObject } from '../models/mongo/MongoSubjectModel'; // Importujemy funkcję

export interface CombinedSubject {
    id: number;
    label: string;
    value: string | any;
    // Pola specyficzne dla MongoDB
    isFromLoggedUser?: boolean;
    sourceDb: 'mysql' | 'mongodb';
}

/**
 * Serwis do pobierania wszystkich przedmiotów z MySQL i MongoDB
 * i łączenia ich w jedną spójną strukturę.
 *
 * @returns {Promise<CombinedSubject[]>} Promise z listą połączonych przedmiotów.
 */
export async function fetchAllSubjects(): Promise<CombinedSubject[]> {
    try {
        // 1. Pobierz przedmioty z MySQL, używając funkcji z modelu MySQL
        const mysqlSubjects: SqlSubject[] = await getAllSubjectsFromSql();
        console.log(`Fetched ${mysqlSubjects.length} subjects from MySQL.`);

        // 2. Pobierz przedmioty z MongoDB, używając funkcji z modelu MongoDB
        const mongoSubjects: MongoSubjectObject[] = await getAllMongoSubjects();
        console.log(`Fetched ${mongoSubjects.length} subjects from MongoDB.`);

        // 3. Połącz dane (logika łączenia pozostaje taka sama, bo to zadanie serwisu)
        const combinedSubjects: CombinedSubject[] = [];

        for (const mysqlSubject of mysqlSubjects) {
            combinedSubjects.push({
                ...mysqlSubject,
                sourceDb: 'mysql',
            });
        }

        for (const mongoSubject of mongoSubjects) {
            combinedSubjects.push({
                ...mongoSubject,
                sourceDb: 'mongodb',
            });
        }

        //check out
        console.log(`Fetched ${combinedSubjects.length} subjects from both batabases.`);

        return combinedSubjects;
    } catch (err: unknown) {
        console.error('Error in subjectService.fetchAllSubjects:', err);
        throw err;
    }
}