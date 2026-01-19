import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export interface JobOpening {
  id: string; // Firestore ID
  applicationId: string; // Unique Application ID (AWCE...)
  category: "School" | "College" | "Corporate" | "Others";
  roleTitle: string;
  department: string;
  location: string[]; // Changed to array

  // New Fields
  center: string[];
  experience: string;
  qualifications: string[];
  skills: string[]; // Required Skills
  numberOfPositions: string; // Keeping as string for flexibility (e.g., "5+") or strict number

  description: string;
  responsibilities: string[];
  eligibility: string[];

  datePosted: string;
  lastUpdated: string;
  createdAt?: string;
}

const JOBS_COLLECTION = "jobs";

// Helper to ensure location and center are always arrays
const formatJobData = (id: string, data: any): JobOpening => {
  return {
    id,
    ...data,
    location: Array.isArray(data.location)
      ? data.location
      : data.location
      ? [data.location]
      : [],
    center: Array.isArray(data.center)
      ? data.center
      : data.center
      ? [data.center]
      : [],
  } as JobOpening;
};

export const jobService = {
  // Get all jobs
  getAllJobs: async (): Promise<JobOpening[]> => {
    try {
      const q = query(
        collection(db, JOBS_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => formatJobData(doc.id, doc.data()));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Get job by ID
  getJobById: async (id: string): Promise<JobOpening | null> => {
    try {
      const docRef = doc(db, JOBS_COLLECTION, id);
      const docSnap = await import("firebase/firestore").then((mod) =>
        mod.getDoc(docRef)
      );

      if (docSnap.exists()) {
        return formatJobData(docSnap.id, docSnap.data());
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      throw error;
    }
  },

  // Get job by Application ID (e.g. AWCE-123456)
  getJobByApplicationId: async (
    applicationId: string
  ): Promise<JobOpening | null> => {
    try {
      const q = query(
        collection(db, JOBS_COLLECTION),
        where("applicationId", "==", applicationId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return formatJobData(doc.id, doc.data());
      }
      return null;
    } catch (error) {
      console.error("Error fetching job by Application ID:", error);
      throw error;
    }
  },

  // Add a new job
  addJob: async (jobData: Omit<JobOpening, "id">): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
        ...jobData,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding job:", error);
      throw error;
    }
  },

  // Update a job
  updateJob: async (
    id: string,
    jobData: Partial<JobOpening>
  ): Promise<void> => {
    try {
      const jobRef = doc(db, JOBS_COLLECTION, id);
      // Remove id from data if it exists to avoid overwriting the document ID field if it's stored there
      const { id: _, ...updateData } = jobData as any;
      await updateDoc(jobRef, updateData);
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  // Delete a job
  deleteJob: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, JOBS_COLLECTION, id));
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },
};
