import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ClientDatabase } from './clientDatabase';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback handler for static/unconfigured deployments where backend returns 404 or Network Error
function handleClientFallback(config: InternalAxiosRequestConfig, errorResponse?: any) {
  const url = (config.url || '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  let body: any = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = config.data;
    }
  }

  const token = localStorage.getItem('jobconnect_token') || '';
  const currentUser = localStorage.getItem('jobconnect_user')
    ? JSON.parse(localStorage.getItem('jobconnect_user')!)
    : null;
  const currentUserId = currentUser?.id || 1;

  // 1. Auth routes
  if (url === '/auth/register' && method === 'post') {
    const result = ClientDatabase.register(body);
    return { data: { success: true, message: 'Account registered successfully', data: result } };
  }

  if (url === '/auth/login' && method === 'post') {
    const result = ClientDatabase.login(body.email, body.password);
    return { data: { success: true, message: 'Login successful', data: result } };
  }

  if (url === '/auth/logout' && method === 'post') {
    return { data: { success: true, message: 'Logged out successfully' } };
  }

  if (url === '/auth/me' && method === 'get') {
    if (currentUser) {
      return { data: { success: true, data: { user: currentUser } } };
    }
    const session = ClientDatabase.getCurrentUser(token);
    if (!session) throw new Error('Unauthenticated');
    return { data: { success: true, data: session } };
  }

  // 2. Profile routes
  if (url === '/profile' && method === 'get') {
    const profile = ClientDatabase.getProfile(currentUserId);
    return { data: { success: true, data: profile } };
  }

  if (url === '/profile' && method === 'put') {
    const updated = ClientDatabase.updateProfile(currentUserId, body);
    return { data: { success: true, message: 'Profile updated successfully', data: updated } };
  }

  const publicProfileMatch = url.match(/^\/profile\/(\d+)$/);
  if (publicProfileMatch && method === 'get') {
    const profile = ClientDatabase.getProfile(parseInt(publicProfileMatch[1], 10));
    return { data: { success: true, data: { profile } } };
  }

  // 3. Company routes
  if (url === '/companies' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getCompanies() } };
  }

  if (url === '/companies/me/profile' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getCompanyByRecruiterId(currentUserId) } };
  }

  if (url === '/companies' && (method === 'post' || method === 'put')) {
    const comp = ClientDatabase.upsertCompany(currentUserId, body);
    return { data: { success: true, message: 'Company profile updated', data: comp } };
  }

  const companyByIdMatch = url.match(/^\/companies\/(\d+)$/);
  if (companyByIdMatch && method === 'get') {
    const compData = ClientDatabase.getCompanyById(parseInt(companyByIdMatch[1], 10));
    return { data: { success: true, data: compData } };
  }

  // 4. Jobs routes
  if (url === '/jobs/recruiter/my' && method === 'get') {
    const res = ClientDatabase.getJobs({ recruiter_id: currentUserId, limit: 100 });
    return { data: { success: true, data: res.jobs } };
  }

  const jobAppsMatch = url.match(/^\/jobs\/(\d+)\/applications$/);
  if (jobAppsMatch && method === 'get') {
    const apps = ClientDatabase.getJobApplications(parseInt(jobAppsMatch[1], 10), currentUserId, currentUser?.role === 'admin');
    return { data: { success: true, data: apps } };
  }

  const jobStatusMatch = url.match(/^\/jobs\/(\d+)\/status$/);
  if (jobStatusMatch && method === 'patch') {
    const updated = ClientDatabase.updateJob(parseInt(jobStatusMatch[1], 10), currentUserId, { status: body.status }, true);
    return { data: { success: true, data: updated } };
  }

  const singleJobMatch = url.match(/^\/jobs\/(\d+)$/);
  if (singleJobMatch) {
    const jobId = parseInt(singleJobMatch[1], 10);
    if (method === 'get') {
      const job = ClientDatabase.getJobById(jobId);
      return { data: { success: true, data: job } };
    }
    if (method === 'put') {
      const updated = ClientDatabase.updateJob(jobId, currentUserId, body, currentUser?.role === 'admin');
      return { data: { success: true, data: updated } };
    }
    if (method === 'delete') {
      ClientDatabase.deleteJob(jobId, currentUserId, currentUser?.role === 'admin');
      return { data: { success: true, message: 'Job deleted' } };
    }
  }

  if (url.startsWith('/jobs') && method === 'get') {
    const params = config.params || {};
    const res = ClientDatabase.getJobs(params);
    return { data: { success: true, data: res.jobs, pagination: res.pagination } };
  }

  if (url === '/jobs' && method === 'post') {
    const job = ClientDatabase.createJob(currentUserId, body);
    return { data: { success: true, message: 'Job vacancy published', data: job } };
  }

  // 5. Applications
  if (url === '/applications' && method === 'post') {
    const app = ClientDatabase.applyForJob(currentUserId, body);
    return { data: { success: true, message: 'Application submitted', data: app } };
  }

  if (url === '/applications/my' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getSeekerApplications(currentUserId) } };
  }

  const appStatusMatch = url.match(/^\/applications\/(\d+)\/status$/);
  if (appStatusMatch && method === 'patch') {
    const updated = ClientDatabase.updateApplicationStatus(parseInt(appStatusMatch[1], 10), body.status);
    return { data: { success: true, message: 'Status updated', data: updated } };
  }

  // 6. Dashboards
  if (url === '/dashboard/stats' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getPlatformStats() } };
  }

  if (url === '/dashboard/seeker' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getSeekerDashboard(currentUserId) } };
  }

  if (url === '/dashboard/recruiter' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getRecruiterDashboard(currentUserId) } };
  }

  if (url === '/admin/overview' && method === 'get') {
    return { data: { success: true, data: ClientDatabase.getAdminOverview() } };
  }

  // If nothing matched, rethrow
  throw errorResponse || new Error('Endpoint not found');
}

// Intercept responses: if 404 or Network Error on static host, fallback seamlessly to client database!
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    const status = error.response?.status;

    // If server returned 404 (e.g. static host without /api backend proxy) or network unreachable
    if (config && (status === 404 || !error.response || error.code === 'ERR_NETWORK')) {
      try {
        console.warn(`[JobConnect Auto-Fallback] API call to ${config.url} returned ${status || 'network error'}. Falling back to automated client database.`);
        const fallbackResult = handleClientFallback(config, error);
        return Promise.resolve(fallbackResult as any);
      } catch (fallbackError: any) {
        // Return a friendly error message from the client database
        return Promise.reject({
          response: {
            data: {
              success: false,
              message: fallbackError.message || 'Operation failed',
            },
            status: 400,
          },
        });
      }
    }

    if (status === 401) {
      const hadToken = localStorage.getItem('jobconnect_token');
      if (hadToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
      }
    }

    return Promise.reject(error);
  }
);
