import { databases } from './appwrite';
import { ID, Query } from 'react-native-appwrite';
import { Sweep } from '../constants/bjj-guards';
import { PositionScore } from '../constants/bjj-positions';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SPARRING_COLLECTION_ID!;

export interface SparringSession {
  $id?: string;
  training_log_id: string;
  sparring_number: number;
  submission_given: number;
  submission_received: number;
  submissions_list: string; // JSON string array
  sweeps_list?: string; // JSON string of Sweep[]
  positions_list?: string; // NEW: JSON string of PositionScore[]
  notes: string;
  partner_name?: string; // Name of sparring partner
  // Competition Fields
  is_competition_match?: boolean;
  result?: 'win' | 'loss' | 'draw';
  method?: 'submission' | 'points' | 'decision' | 'dq';
  points_my?: number;
  points_opp?: number;
  stage?: 'final' | 'semi_final' | 'quarter_final' | 'elimination' | 'round_robin' | 'bronze_match';
  submission_technique?: string;
}

export const createSparring = async (data: Omit<SparringSession, '$id'>) => {
  return await databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    data
  );
};

export const getSparringsForTraining = async (trainingId: string): Promise<SparringSession[]> => {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    [Query.equal('training_log_id', trainingId)]
  );
  return response.documents.map(doc => ({
    $id: doc.$id,
    training_log_id: doc.training_log_id as string,
    sparring_number: doc.sparring_number as number,
    submission_given: doc.submission_given as number,
    submission_received: doc.submission_received as number,
    submissions_list: doc.submissions_list as string,
    sweeps_list: doc.sweeps_list as string | undefined,
    positions_list: doc.positions_list as string | undefined,
    notes: doc.notes as string,
    partner_name: doc.partner_name as string | undefined,
    is_competition_match: doc.is_competition_match as boolean | undefined,
    result: doc.result as any,
    method: doc.method as any,
    points_my: doc.points_my as number | undefined,
    points_opp: doc.points_opp as number | undefined,
    stage: doc.stage as any,
    submission_technique: doc.submission_technique as string | undefined,
  }));
};

export const updateSparring = async (id: string, data: Partial<SparringSession>) => {
  return await databases.updateDocument(
    DATABASE_ID,
    COLLECTION_ID,
    id,
    data
  );
};

export const deleteSparring = async (id: string) => {
  return await databases.deleteDocument(
    DATABASE_ID,
    COLLECTION_ID,
    id
  );
};

export const deleteAllSparringsForTraining = async (trainingId: string) => {
  const sessions = await getSparringsForTraining(trainingId);
  await Promise.all(sessions.map(s => s.$id && deleteSparring(s.$id)));
};
