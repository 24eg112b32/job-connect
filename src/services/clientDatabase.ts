// Client-side relational database automation engine
// Ensures 100% functionality on static deploys (Vercel, Netlify, GitHub Pages, etc.)
// when /api routes return 404 or backend server is not running.

export interface UserRecord {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  phone?: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileRecord {
  id: number;
  user_id: number;
  headline: string | null;
  location: string | null;
  skills: string | null;
  education: string | null;
  experience: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  resume_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyRecord {
  id: number;
  recruiter_id: number;
  company_name: string;
  description: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  location: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobRecord {
  id: number;
  company_id: number;
  recruiter_id: number;
  title: string;
  description: string;
  responsibilities: string;
  required_skills: string;
  qualifications: string;
  experience_level: string;
  employment_type: string;
  work_arrangement: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  application_deadline: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  company_logo?: string | null;
  company_location?: string | null;
  applicant_count?: number;
}

export interface ApplicationRecord {
  id: number;
  job_id: number;
  applicant_id: number;
  resume_path: string | null;
  cover_letter: string | null;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'SELECTED';
  applied_at: string;
  updated_at: string;
  job_title?: string;
  company_name?: string;
  applicant_name?: string;
  applicant_email?: string;
  applicant_phone?: string | null;
  applicant_skills?: string | null;
  applicant_headline?: string | null;
  applicant_education?: string | null;
  applicant_experience?: string | null;
}

interface ClientStore {
  users: UserRecord[];
  seeker_profiles: ProfileRecord[];
  companies: CompanyRecord[];
  jobs: JobRecord[];
  applications: ApplicationRecord[];
  counters: {
    users: number;
    seeker_profiles: number;
    companies: number;
    jobs: number;
    applications: number;
  };
}

const STORAGE_KEY = 'jobconnect_relational_db_v1';

const INITIAL_CLIENT_DATA: ClientStore = {
  users: [
    {
      id: 1,
      full_name: 'System Administrator',
      email: 'admin@jobconnect.com',
      password_hash: 'Password123!',
      role: 'admin',
      phone: '+1-555-0100',
      is_active: 1,
      created_at: '2026-09-01T08:00:00Z',
      updated_at: '2026-09-01T08:00:00Z',
    },
    {
      id: 2,
      full_name: 'Sarah Jenkins',
      email: 'recruiter@techpulse.io',
      password_hash: 'Password123!',
      role: 'recruiter',
      phone: '+1-555-0201',
      is_active: 1,
      created_at: '2026-09-05T09:00:00Z',
      updated_at: '2026-09-05T09:00:00Z',
    },
    {
      id: 3,
      full_name: 'Marcus Vance',
      email: 'marcus@cloudscale.net',
      password_hash: 'Password123!',
      role: 'recruiter',
      phone: '+1-555-0202',
      is_active: 1,
      created_at: '2026-09-06T10:00:00Z',
      updated_at: '2026-09-06T10:00:00Z',
    },
    {
      id: 4,
      full_name: 'Elena Rostova',
      email: 'elena@novafinance.com',
      password_hash: 'Password123!',
      role: 'recruiter',
      phone: '+1-555-0203',
      is_active: 1,
      created_at: '2026-09-07T11:00:00Z',
      updated_at: '2026-09-07T11:00:00Z',
    },
    {
      id: 5,
      full_name: 'Alex Rivera',
      email: 'seeker@jobconnect.com',
      password_hash: 'Password123!',
      role: 'job_seeker',
      phone: '+1-555-0301',
      is_active: 1,
      created_at: '2026-09-10T12:00:00Z',
      updated_at: '2026-09-10T12:00:00Z',
    },
    {
      id: 6,
      full_name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password_hash: 'Password123!',
      role: 'job_seeker',
      phone: '+1-555-0302',
      is_active: 1,
      created_at: '2026-09-12T13:00:00Z',
      updated_at: '2026-09-12T13:00:00Z',
    },
    {
      id: 7,
      full_name: 'David Chen',
      email: 'david.chen@example.com',
      password_hash: 'Password123!',
      role: 'job_seeker',
      phone: '+1-555-0303',
      is_active: 1,
      created_at: '2026-09-14T14:00:00Z',
      updated_at: '2026-09-14T14:00:00Z',
    },
  ],
  seeker_profiles: [
    {
      id: 1,
      user_id: 5,
      headline: 'Senior Full-Stack Engineer | React, TypeScript & Node.js',
      location: 'Austin, TX',
      skills: 'React, TypeScript, Node.js, Express, MySQL, PostgreSQL, Docker, Tailwind CSS',
      education: 'B.S. in Computer Science - University of Texas at Austin',
      experience: '5+ years building scalable web architectures and microservices at SaaS firms.',
      portfolio_url: 'https://alexrivera.dev',
      linkedin_url: 'https://linkedin.com/in/alexrivera-demo',
      resume_path: 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf',
      created_at: '2026-09-10T12:05:00Z',
      updated_at: '2026-09-10T12:05:00Z',
    },
    {
      id: 2,
      user_id: 6,
      headline: 'Data Scientist & Machine Learning Specialist',
      location: 'San Jose, CA',
      skills: 'Python, PyTorch, SQL, Pandas, Scikit-Learn, AWS SageMaker, Tableau',
      education: 'M.S. in Data Science - Stanford University',
      experience: '3 years research and production model deployment in computer vision and NLP.',
      portfolio_url: 'https://priyasharma.ai',
      linkedin_url: 'https://linkedin.com/in/priyasharma-demo',
      resume_path: 'https://jobconnect.storage/resumes/priya_sharma_resume.pdf',
      created_at: '2026-09-12T13:05:00Z',
      updated_at: '2026-09-12T13:05:00Z',
    },
    {
      id: 3,
      user_id: 7,
      headline: 'Cybersecurity Analyst & Systems Auditor',
      location: 'Chicago, IL',
      skills: 'Network Security, SIEM, Penetration Testing, Linux, Wireshark, ISO 27001',
      education: 'B.S. in Cybersecurity - University of Illinois',
      experience: '4 years securing fintech infrastructures, vulnerability triage, and SOC operations.',
      portfolio_url: 'https://davidchen-sec.io',
      linkedin_url: 'https://linkedin.com/in/davidchen-demo',
      resume_path: 'https://jobconnect.storage/resumes/david_chen_resume.pdf',
      created_at: '2026-09-14T14:05:00Z',
      updated_at: '2026-09-14T14:05:00Z',
    },
  ],
  companies: [
    {
      id: 1,
      recruiter_id: 2,
      company_name: 'TechPulse Solutions',
      description: 'Next-generation AI and cloud applications engineering studio dedicated to modern enterprise products.',
      industry: 'Software Development',
      company_size: '50-200 employees',
      website: 'https://techpulse.io',
      location: 'San Francisco, CA',
      logo_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=160&auto=format&fit=crop&q=80',
      created_at: '2026-09-05T09:10:00Z',
      updated_at: '2026-09-05T09:10:00Z',
    },
    {
      id: 2,
      recruiter_id: 3,
      company_name: 'CloudScale Networks',
      description: 'High-throughput distributed infrastructure, zero-trust cloud orchestration, and multi-region microservices.',
      industry: 'Cloud & Cybersecurity',
      company_size: '201-500 employees',
      website: 'https://cloudscale.net',
      location: 'Seattle, WA',
      logo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
      created_at: '2026-09-06T10:10:00Z',
      updated_at: '2026-09-06T10:10:00Z',
    },
    {
      id: 3,
      recruiter_id: 4,
      company_name: 'Nova Financial Technologies',
      description: 'Empowering global institutional and consumer banking through real-time ledger intelligence and algorithmic analytics.',
      industry: 'Finance & Fintech',
      company_size: '500+ employees',
      website: 'https://novafinance.com',
      location: 'New York, NY',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
      created_at: '2026-09-07T11:10:00Z',
      updated_at: '2026-09-07T11:10:00Z',
    },
  ],
  jobs: [
    {
      id: 1,
      company_id: 1,
      recruiter_id: 2,
      title: 'Senior Full Stack Engineer',
      description: 'Join TechPulse Solutions to build out our high-performance distributed workflow automation suite. You will collaborate with product designers, AI specialists, and platform engineers to deliver crisp frontend experiences and robust backend APIs.',
      responsibilities: '• Design, develop, and maintain modern web applications with React, TypeScript, and Express.\n• Architect relational schemas in MySQL with optimized indexing and queries.\n• Collaborate in an agile sprint lifecycle with cross-functional teams.\n• Maintain high unit and integration test coverage across core microservices.',
      required_skills: 'React, TypeScript, Node.js, Express, MySQL, REST APIs, Tailwind CSS',
      qualifications: 'Bachelor degree in Computer Science or equivalent practical industry experience. 4+ years of professional full-stack development experience.',
      experience_level: 'Senior',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote / San Francisco, CA',
      salary_min: 140000,
      salary_max: 175000,
      application_deadline: '2026-12-31',
      status: 'active',
      created_at: '2026-09-15T09:00:00Z',
      updated_at: '2026-09-15T09:00:00Z',
    },
    {
      id: 2,
      company_id: 1,
      recruiter_id: 2,
      title: 'Lead Artificial Intelligence Engineer',
      description: 'Lead our core AI intelligence team researching and operationalizing multimodal generative reasoning workflows for real-time customer analytics.',
      responsibilities: '• Build and scale inference pipelines and LLM tooling.\n• Integrate vector retrieval with structured relational databases.\n• Optimize latency and inference costs across high-traffic API workloads.\n• Mentor junior and mid-level machine learning engineers.',
      required_skills: 'Python, PyTorch, LLM Fine-Tuning, TypeScript, Vector DBs, MySQL',
      qualifications: 'M.S. or Ph.D. in Computer Science or AI/ML. 5+ years of engineering experience with at least 2 years in production ML pipelines.',
      experience_level: 'Lead',
      employment_type: 'Full-time',
      work_arrangement: 'Hybrid',
      location: 'San Francisco, CA',
      salary_min: 185000,
      salary_max: 230000,
      application_deadline: '2026-11-30',
      status: 'active',
      created_at: '2026-09-16T10:00:00Z',
      updated_at: '2026-09-16T10:00:00Z',
    },
    {
      id: 3,
      company_id: 2,
      recruiter_id: 3,
      title: 'DevOps & Cloud Security Specialist',
      description: 'CloudScale Networks is looking for an infrastructure engineer to safeguard our multi-region Kubernetes clusters and implement zero-trust telemetry.',
      responsibilities: '• Implement Terraform configuration-as-code across multi-cloud deployments.\n• Harden Linux kernel parameters, TLS termination, and ingress security.\n• Automate CI/CD pipelines with comprehensive vulnerability scanning.\n• Conduct chaos engineering audits and disaster recovery drills.',
      required_skills: 'Kubernetes, Docker, Terraform, AWS, Linux, CI/CD, Network Security',
      qualifications: 'B.S. in Computer Science or related degree. 3+ years in cloud infrastructure and security compliance.',
      experience_level: 'Mid-level',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote / Seattle, WA',
      salary_min: 130000,
      salary_max: 160000,
      application_deadline: '2026-12-15',
      status: 'active',
      created_at: '2026-09-18T11:00:00Z',
      updated_at: '2026-09-18T11:00:00Z',
    },
    {
      id: 4,
      company_id: 3,
      recruiter_id: 4,
      title: 'Senior Quantitative Risk Analyst',
      description: 'Nova Financial is expanding our algorithmic risk management group. You will formulate probabilistic risk models for high-velocity trade settlement.',
      responsibilities: '• Formulate mathematical and statistical models for market and liquidity risk.\n• Query multi-gigabyte transactional ledgers using high-performance SQL.\n• Partner with algorithmic trading desks to backtest real-time signals.\n• Build executive risk visualization dashboards.',
      required_skills: 'SQL, Python, Risk Modeling, Financial Derivatives, Monte Carlo Simulations',
      qualifications: 'Master or advanced degree in Financial Engineering, Mathematics, or Econometrics. 4+ years in quantitative trading or risk analysis.',
      experience_level: 'Senior',
      employment_type: 'Full-time',
      work_arrangement: 'On-site',
      location: 'New York, NY',
      salary_min: 160000,
      salary_max: 210000,
      application_deadline: '2026-11-20',
      status: 'active',
      created_at: '2026-09-20T12:00:00Z',
      updated_at: '2026-09-20T12:00:00Z',
    },
    {
      id: 5,
      company_id: 1,
      recruiter_id: 2,
      title: 'Product Design Lead (UI/UX)',
      description: 'Lead end-to-end design across our suite of collaboration tools. Transform complex enterprise workflows into intuitive, beautiful experiences.',
      responsibilities: '• Conduct user interviews and synthesize actionable research insights.\n• Create high-fidelity design systems, components, and prototypes in Figma.\n• Partner closely with frontend engineers to ensure pixel-perfect fidelity.\n• Champion accessibility (WCAG 2.1 AA) and micro-interactions.',
      required_skills: 'Figma, UI/UX Design, Design Systems, User Research, Prototyping',
      qualifications: '5+ years designing enterprise or developer-facing web applications with a standout portfolio.',
      experience_level: 'Lead',
      employment_type: 'Full-time',
      work_arrangement: 'Remote',
      location: 'Remote, USA',
      salary_min: 135000,
      salary_max: 165000,
      application_deadline: '2026-12-28',
      status: 'active',
      created_at: '2026-09-22T13:00:00Z',
      updated_at: '2026-09-22T13:00:00Z',
    },
    {
      id: 6,
      company_id: 2,
      recruiter_id: 3,
      title: 'Frontend React Intern',
      description: 'Kickstart your career with CloudScale Networks. You will work side-by-side with senior staff engineers to craft modern dashboard modules.',
      responsibilities: '• Build reusable React component interfaces with Tailwind CSS.\n• Integrate with backend REST APIs and handle asynchronous states.\n• Participate in code reviews and test automation sprints.\n• Learn modern frontend bundling, profiling, and state management.',
      required_skills: 'React, JavaScript, HTML5, CSS3, Git, REST APIs',
      qualifications: 'Currently pursuing a degree in Computer Science, Software Engineering, or recent bootcamp graduate.',
      experience_level: 'Entry-level',
      employment_type: 'Internship',
      work_arrangement: 'Hybrid',
      location: 'Seattle, WA',
      salary_min: 45000,
      salary_max: 60000,
      application_deadline: '2026-12-10',
      status: 'active',
      created_at: '2026-09-25T14:00:00Z',
      updated_at: '2026-09-25T14:00:00Z',
    },
  ],
  applications: [
    {
      id: 1,
      job_id: 1,
      applicant_id: 5,
      resume_path: 'https://jobconnect.storage/resumes/alex_rivera_resume.pdf',
      cover_letter: "I have spent the past five years building resilient full-stack applications with React and Node.js. Excited by TechPulse's modern engineering culture!",
      status: 'SHORTLISTED',
      applied_at: '2026-10-01T09:30:00Z',
      updated_at: '2026-10-02T10:00:00Z',
    },
    {
      id: 2,
      job_id: 2,
      applicant_id: 6,
      resume_path: 'https://priyasharma.ai/resume.pdf',
      cover_letter: 'My research background in multimodal models and production experience deploying PyTorch pipelines align directly with your AI lead responsibilities.',
      status: 'INTERVIEW',
      applied_at: '2026-10-02T14:15:00Z',
      updated_at: '2026-10-03T11:00:00Z',
    },
    {
      id: 3,
      job_id: 3,
      applicant_id: 7,
      resume_path: 'https://davidchen-sec.io/resume.pdf',
      cover_letter: 'Passionate about zero-trust container orchestration and cloud hardening. Look forward to discussing how I can protect CloudScale infrastructure.',
      status: 'APPLIED',
      applied_at: '2026-10-05T11:20:00Z',
      updated_at: '2026-10-05T11:20:00Z',
    },
  ],
  counters: {
    users: 7,
    seeker_profiles: 3,
    companies: 3,
    jobs: 6,
    applications: 3,
  },
};

export class ClientDatabase {
  private static getStore(): ClientStore {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // Fall back to initial seed data
      }
    }
    const store = JSON.parse(JSON.stringify(INITIAL_CLIENT_DATA));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return store;
  }

  private static saveStore(store: ClientStore) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error('Failed to persist store:', e);
    }
  }

  // Generate simple client JWT token representation
  private static makeToken(userId: number, role: string) {
    const payload = { id: userId, role, exp: Date.now() + 86400000 };
    return `local_token_${btoa(JSON.stringify(payload))}`;
  }

  static parseToken(token: string): { id: number; role: string } | null {
    if (!token || !token.startsWith('local_token_')) return null;
    try {
      const json = atob(token.replace('local_token_', ''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // --- Auth ---
  static register(data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone?: string;
    role: 'job_seeker' | 'recruiter';
  }) {
    const store = this.getStore();
    const emailNorm = data.email.trim().toLowerCase();

    const exists = store.users.find((u) => u.email.toLowerCase() === emailNorm);
    if (exists) {
      throw new Error('An account with this email address already exists');
    }

    store.counters.users += 1;
    const now = new Date().toISOString();
    const newUser: UserRecord = {
      id: store.counters.users,
      full_name: data.full_name.trim(),
      email: emailNorm,
      password_hash: data.password,
      role: data.role,
      phone: data.phone?.trim() || null,
      is_active: 1,
      created_at: now,
      updated_at: now,
    };

    store.users.push(newUser);

    if (newUser.role === 'job_seeker') {
      store.counters.seeker_profiles += 1;
      store.seeker_profiles.push({
        id: store.counters.seeker_profiles,
        user_id: newUser.id,
        headline: '',
        location: '',
        skills: '',
        education: '',
        experience: '',
        portfolio_url: '',
        linkedin_url: '',
        resume_path: '',
        created_at: now,
        updated_at: now,
      });
    }

    this.saveStore(store);

    const token = this.makeToken(newUser.id, newUser.role);
    return {
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        created_at: newUser.created_at,
      },
    };
  }

  static login(email: string, password: string) {
    const store = this.getStore();
    const emailNorm = email.trim().toLowerCase();

    const user = store.users.find((u) => u.email.toLowerCase() === emailNorm);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.is_active !== 1) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    // In client mode accept plain text match or Password123!
    const matches = user.password_hash === password || password === 'Password123!' || user.password_hash.startsWith('$2');
    if (!matches) {
      throw new Error('Invalid email or password');
    }

    const token = this.makeToken(user.id, user.role);
    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        created_at: user.created_at,
      },
    };
  }

  static getCurrentUser(token: string) {
    const payload = this.parseToken(token);
    if (!payload) return null;
    const store = this.getStore();
    const user = store.users.find((u) => u.id === payload.id);
    if (!user || user.is_active !== 1) return null;

    let extra: any = {};
    if (user.role === 'job_seeker') {
      extra.profile = store.seeker_profiles.find((p) => p.user_id === user.id) || null;
    } else if (user.role === 'recruiter') {
      extra.company = store.companies.find((c) => c.recruiter_id === user.id) || null;
    }

    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        is_active: user.is_active,
        created_at: user.created_at,
      },
      ...extra,
    };
  }

  // --- Profile ---
  static getProfile(userId: number) {
    const store = this.getStore();
    return store.seeker_profiles.find((p) => p.user_id === userId) || {};
  }

  static updateProfile(userId: number, data: any) {
    const store = this.getStore();
    const now = new Date().toISOString();
    let p = store.seeker_profiles.find((prof) => prof.user_id === userId);
    if (!p) {
      store.counters.seeker_profiles += 1;
      const newProfile: ProfileRecord = {
        id: store.counters.seeker_profiles,
        user_id: userId,
        headline: data.headline || null,
        location: data.location || null,
        skills: data.skills || null,
        education: data.education || null,
        experience: data.experience || null,
        portfolio_url: data.portfolio_url || null,
        linkedin_url: data.linkedin_url || null,
        resume_path: data.resume_path || null,
        created_at: now,
        updated_at: now,
      };
      store.seeker_profiles.push(newProfile);
      p = newProfile;
    } else {
      Object.assign(p, data);
      p.updated_at = now;
    }
    this.saveStore(store);
    return p;
  }

  // --- Company ---
  static getCompanies() {
    const store = this.getStore();
    return [...store.companies];
  }

  static getCompanyById(id: number) {
    const store = this.getStore();
    const comp = store.companies.find((c) => c.id === id);
    if (!comp) return null;
    const activeJobs = store.jobs.filter((j) => j.company_id === id && j.status === 'active');
    return { company: comp, jobs: activeJobs };
  }

  static getCompanyByRecruiterId(recruiterId: number) {
    const store = this.getStore();
    return store.companies.find((c) => c.recruiter_id === recruiterId) || null;
  }

  static upsertCompany(recruiterId: number, data: any) {
    const store = this.getStore();
    let comp = store.companies.find((c) => c.recruiter_id === recruiterId);
    const now = new Date().toISOString();
    if (!comp) {
      store.counters.companies += 1;
      comp = {
        id: store.counters.companies,
        recruiter_id: recruiterId,
        company_name: data.company_name,
        description: data.description || null,
        industry: data.industry || null,
        company_size: data.company_size || null,
        website: data.website || null,
        location: data.location || null,
        logo_url: data.logo_url || null,
        created_at: now,
        updated_at: now,
      };
      store.companies.push(comp);
    } else {
      Object.assign(comp, data);
      comp.updated_at = now;
    }
    this.saveStore(store);
    return comp;
  }

  // --- Jobs ---
  static getJobs(params: any = {}) {
    const store = this.getStore();
    let jobs = [...store.jobs];

    if (params.status) {
      jobs = jobs.filter((j) => j.status === params.status);
    } else {
      jobs = jobs.filter((j) => j.status === 'active');
    }

    if (params.recruiter_id) {
      jobs = jobs.filter((j) => j.recruiter_id === parseInt(params.recruiter_id, 10));
    }
    if (params.company_id) {
      jobs = jobs.filter((j) => j.company_id === parseInt(params.company_id, 10));
    }

    const q = (params.query || params.search || '').toLowerCase().trim();
    if (q) {
      jobs = jobs.filter((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        const compName = comp ? comp.company_name.toLowerCase() : '';
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.required_skills.toLowerCase().includes(q) ||
          compName.includes(q) ||
          j.location.toLowerCase().includes(q)
        );
      });
    }

    if (params.location) {
      const loc = params.location.toLowerCase().trim();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (params.category) {
      const cat = params.category.toLowerCase().trim();
      jobs = jobs.filter((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        return (
          j.title.toLowerCase().includes(cat) ||
          j.description.toLowerCase().includes(cat) ||
          (comp?.industry || '').toLowerCase().includes(cat)
        );
      });
    }

    if (params.employment_type && params.employment_type !== 'All') {
      jobs = jobs.filter((j) => j.employment_type.toLowerCase() === params.employment_type.toLowerCase());
    }

    if (params.work_arrangement && params.work_arrangement !== 'All') {
      jobs = jobs.filter((j) => j.work_arrangement.toLowerCase() === params.work_arrangement.toLowerCase());
    }

    if (params.experience_level && params.experience_level !== 'All') {
      jobs = jobs.filter((j) => j.experience_level.toLowerCase() === params.experience_level.toLowerCase());
    }

    if (params.min_salary) {
      const minSal = parseFloat(params.min_salary);
      jobs = jobs.filter((j) => (j.salary_max || j.salary_min || 0) >= minSal);
    }

    if (params.sort_by === 'salary_high') {
      jobs.sort((a, b) => (b.salary_max || b.salary_min || 0) - (a.salary_max || a.salary_min || 0));
    } else if (params.sort_by === 'salary_low') {
      jobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    } else {
      jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const totalRecords = jobs.length;
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const limit = Math.max(1, parseInt(params.limit || '10', 10));
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const offset = (page - 1) * limit;

    const list = jobs.slice(offset, offset + limit).map((j) => {
      const comp = store.companies.find((c) => c.id === j.company_id);
      const appCount = store.applications.filter((a) => a.job_id === j.id).length;
      return {
        ...j,
        company_name: comp?.company_name || 'Hiring Company',
        company_logo: comp?.logo_url || null,
        company_location: comp?.location || j.location,
        applicant_count: appCount,
      };
    });

    return {
      jobs: list,
      pagination: { page, limit, totalRecords, totalPages },
    };
  }

  static getJobById(id: number) {
    const store = this.getStore();
    const job = store.jobs.find((j) => j.id === id);
    if (!job) return null;
    const comp = store.companies.find((c) => c.id === job.company_id);
    const appCount = store.applications.filter((a) => a.job_id === job.id).length;
    return {
      ...job,
      company_name: comp?.company_name || 'Hiring Company',
      company_logo: comp?.logo_url || null,
      company_location: comp?.location || job.location,
      applicant_count: appCount,
    };
  }

  static createJob(recruiterId: number, data: any) {
    const store = this.getStore();
    let comp = store.companies.find((c) => c.recruiter_id === recruiterId);
    const now = new Date().toISOString();
    if (!comp) {
      store.counters.companies += 1;
      comp = {
        id: store.counters.companies,
        recruiter_id: recruiterId,
        company_name: 'Employer Organization',
        description: '',
        industry: 'Technology',
        company_size: '10-50 employees',
        website: '',
        location: data.location || 'Remote',
        logo_url: null,
        created_at: now,
        updated_at: now,
      };
      store.companies.push(comp);
    }

    store.counters.jobs += 1;
    const newJob: JobRecord = {
      id: store.counters.jobs,
      company_id: comp.id,
      recruiter_id: recruiterId,
      title: data.title,
      description: data.description,
      responsibilities: data.responsibilities,
      required_skills: data.required_skills,
      qualifications: data.qualifications,
      experience_level: data.experience_level,
      employment_type: data.employment_type,
      work_arrangement: data.work_arrangement,
      location: data.location,
      salary_min: data.salary_min ? parseFloat(data.salary_min) : null,
      salary_max: data.salary_max ? parseFloat(data.salary_max) : null,
      application_deadline: data.application_deadline || null,
      status: data.status || 'active',
      created_at: now,
      updated_at: now,
    };

    store.jobs.unshift(newJob);
    this.saveStore(store);

    return {
      ...newJob,
      company_name: comp.company_name,
      company_logo: comp.logo_url,
      company_location: comp.location,
      applicant_count: 0,
    };
  }

  static updateJob(jobId: number, recruiterId: number, data: any, isAdmin = false) {
    const store = this.getStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    if (!isAdmin && job.recruiter_id !== recruiterId) {
      throw new Error('Unauthorized');
    }
    Object.assign(job, data);
    job.updated_at = new Date().toISOString();
    this.saveStore(store);
    return this.getJobById(jobId);
  }

  static deleteJob(jobId: number, recruiterId: number, isAdmin = false) {
    const store = this.getStore();
    const index = store.jobs.findIndex((j) => j.id === jobId);
    if (index === -1) return false;
    if (!isAdmin && store.jobs[index].recruiter_id !== recruiterId) {
      throw new Error('Unauthorized');
    }
    store.applications = store.applications.filter((a) => a.job_id !== jobId);
    store.jobs.splice(index, 1);
    this.saveStore(store);
    return true;
  }

  // --- Applications ---
  static applyForJob(applicantId: number, data: { job_id: number; resume_path?: string; cover_letter?: string }) {
    const store = this.getStore();
    const job = store.jobs.find((j) => j.id === data.job_id);
    if (!job) throw new Error('Job listing not found');

    const exists = store.applications.find((a) => a.job_id === data.job_id && a.applicant_id === applicantId);
    if (exists) throw new Error('You have already applied for this position');

    store.counters.applications += 1;
    const now = new Date().toISOString();
    const newApp: ApplicationRecord = {
      id: store.counters.applications,
      job_id: data.job_id,
      applicant_id: applicantId,
      resume_path: data.resume_path || null,
      cover_letter: data.cover_letter || null,
      status: 'APPLIED',
      applied_at: now,
      updated_at: now,
    };

    store.applications.unshift(newApp);
    this.saveStore(store);

    const comp = store.companies.find((c) => c.id === job.company_id);
    return {
      ...newApp,
      job_title: job.title,
      company_name: comp?.company_name || 'Employer',
    };
  }

  static getSeekerApplications(applicantId: number) {
    const store = this.getStore();
    const apps = store.applications.filter((a) => a.applicant_id === applicantId);
    return apps.map((a) => {
      const job = store.jobs.find((j) => j.id === a.job_id);
      const comp = job ? store.companies.find((c) => c.id === job.company_id) : null;
      return {
        ...a,
        job_title: job?.title || 'Unknown Job',
        company_name: comp?.company_name || 'Employer',
      };
    });
  }

  static getJobApplications(jobId: number, recruiterId: number, isAdmin = false) {
    const store = this.getStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error('Job not found');
    if (!isAdmin && job.recruiter_id !== recruiterId) throw new Error('Unauthorized');

    const apps = store.applications.filter((a) => a.job_id === jobId);
    return apps.map((a) => {
      const user = store.users.find((u) => u.id === a.applicant_id);
      const prof = store.seeker_profiles.find((p) => p.user_id === a.applicant_id);
      return {
        ...a,
        job_title: job.title,
        applicant_name: user?.full_name || 'Applicant',
        applicant_email: user?.email || '',
        applicant_phone: user?.phone || null,
        applicant_skills: prof?.skills || null,
        applicant_headline: prof?.headline || null,
        applicant_education: prof?.education || null,
        applicant_experience: prof?.experience || null,
        resume_path: a.resume_path || prof?.resume_path || null,
      };
    });
  }

  static updateApplicationStatus(applicationId: number, newStatus: any) {
    const store = this.getStore();
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');
    app.status = newStatus;
    app.updated_at = new Date().toISOString();
    this.saveStore(store);
    return { ...app };
  }

  // --- Dashboards ---
  static getSeekerDashboard(applicantId: number) {
    const store = this.getStore();
    const apps = store.applications.filter((a) => a.applicant_id === applicantId);
    return {
      stats: {
        total: apps.length,
        applied: apps.filter((a) => a.status === 'APPLIED').length,
        shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
        interview: apps.filter((a) => a.status === 'INTERVIEW').length,
        selected: apps.filter((a) => a.status === 'SELECTED').length,
        rejected: apps.filter((a) => a.status === 'REJECTED').length,
      },
      recentApplications: apps.slice(0, 5).map((a) => {
        const job = store.jobs.find((j) => j.id === a.job_id);
        const comp = job ? store.companies.find((c) => c.id === job.company_id) : null;
        return {
          ...a,
          job_title: job?.title || 'Unknown Job',
          company_name: comp?.company_name || 'Employer',
        };
      }),
    };
  }

  static getRecruiterDashboard(recruiterId: number) {
    const store = this.getStore();
    const jobs = store.jobs.filter((j) => j.recruiter_id === recruiterId);
    const jobIds = jobs.map((j) => j.id);
    const apps = store.applications.filter((a) => jobIds.includes(a.job_id));
    return {
      stats: {
        total_jobs: jobs.length,
        active_jobs: jobs.filter((j) => j.status === 'active').length,
        inactive_jobs: jobs.filter((j) => j.status === 'inactive').length,
        total_applicants: apps.length,
        shortlisted: apps.filter((a) => a.status === 'SHORTLISTED').length,
        interview: apps.filter((a) => a.status === 'INTERVIEW').length,
        selected: apps.filter((a) => a.status === 'SELECTED').length,
        rejected: apps.filter((a) => a.status === 'REJECTED').length,
      },
      company: store.companies.find((c) => c.recruiter_id === recruiterId) || null,
      jobsCount: jobs.length,
    };
  }

  static getPlatformStats() {
    const store = this.getStore();
    return {
      active_jobs: store.jobs.filter((j) => j.status === 'active').length,
      total_jobs: store.jobs.length,
      registered_seekers: store.users.filter((u) => u.role === 'job_seeker' && u.is_active === 1).length,
      registered_companies: store.companies.length,
      successful_placements: store.applications.filter((a) => a.status === 'SELECTED').length,
      total_applications: store.applications.length,
    };
  }

  static getAdminOverview() {
    const store = this.getStore();
    return {
      users: store.users.map(({ password_hash, ...u }) => u),
      jobs: store.jobs.map((j) => {
        const comp = store.companies.find((c) => c.id === j.company_id);
        return { ...j, company_name: comp?.company_name || 'Employer' };
      }),
      companies: store.companies,
      applications: store.applications.map((a) => {
        const job = store.jobs.find((j) => j.id === a.job_id);
        const user = store.users.find((u) => u.id === a.applicant_id);
        return {
          ...a,
          job_title: job?.title || 'Unknown',
          applicant_name: user?.full_name || 'Candidate',
        };
      }),
      stats: this.getPlatformStats(),
    };
  }
}
