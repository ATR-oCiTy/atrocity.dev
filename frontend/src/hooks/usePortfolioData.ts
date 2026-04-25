import { useState, useEffect } from 'react';
import { Experience, Education, Profile, SkillCategory, Client } from '../types';
import { api } from '../services/api';

interface PortfolioData {
  profile: Profile | null;
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  clients: Client[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches all portfolio data concurrently from the backend API.
 */
export const usePortfolioData = (): PortfolioData => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getExperiences(),
      api.getEducation(),
      api.getProfile(),
      api.getSkills(),
      api.getClients(),
    ])
      .then(([expData, eduData, profileData, skillsData, clientsData]) => {
        setExperiences(expData);
        setEducation(eduData);
        setProfile(profileData);
        setSkills(skillsData);
        setClients(clientsData);
      })
      .catch((err: Error) => {
        console.error('Failed to load portfolio data:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { profile, experiences, education, skills, clients, loading, error };
};
