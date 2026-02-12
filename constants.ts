import { Job } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    description: `We are looking for a Senior Frontend Engineer to join our team. 
    Requirements:
    - 5+ years of experience with React and TypeScript.
    - Deep understanding of state management (Redux, Zustand).
    - Experience with Tailwind CSS.
    - Strong communication skills.
    We are building the next generation of workflow automation tools.`,
    postedAt: '2023-10-25',
    salary: '$140k - $180k',
  },
  {
    id: 'job-102',
    title: 'Python Backend Developer',
    company: 'DataCorp',
    location: 'New York, NY',
    description: `Seeking a Python developer for our data engineering team.
    Must have:
    - Proficiency in Python, Django, or FastAPI.
    - Experience with Playwright or Selenium for web scraping.
    - Knowledge of SQL and NoSQL databases.
    - Docker and Kubernetes experience is a plus.`,
    postedAt: '2023-10-26',
    salary: '$130k - $160k',
  },
  {
    id: 'job-103',
    title: 'Product Manager',
    company: 'InnovateX',
    location: 'San Francisco, CA',
    description: `Lead our product team to success.
    - Define product roadmap.
    - Work closely with engineering and design.
    - Strong analytical skills.
    - Experience in B2B SaaS.`,
    postedAt: '2023-10-24',
    salary: '$150k - $200k',
  },
  {
    id: 'job-104',
    title: 'Full Stack Engineer (AI Focused)',
    company: 'Nebula AI',
    location: 'Remote',
    description: `Join our AI startup.
    Stack: Python (FastAPI), React, PostgreSQL.
    Experience with LLMs (OpenAI, Gemini) is highly desirable.
    We need someone who can move fast and break things.`,
    postedAt: '2023-10-27',
    salary: '$120k - $150k + Equity',
  },
  {
    id: 'job-105',
    title: 'Junior Web Developer',
    company: 'Creative Agency',
    location: 'Austin, TX',
    description: `Looking for a junior dev to help with client websites.
    - HTML, CSS, Basic JS.
    - Wordpress experience preferred.
    - Willingness to learn.`,
    postedAt: '2023-10-22',
    salary: '$60k - $80k',
  }
];

export const INITIAL_SETTINGS = {
  skills: "Python, React, TypeScript, Web Scraping, Gemini API, AI Agents, Backend Development",
  discordWebhook: "",
  minRatingForNotify: 8
};
