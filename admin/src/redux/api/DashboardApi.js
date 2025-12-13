import axios from '../../utils/axios';

const dashboardApi = {
    getStats: () => axios.get('/api/dashboard')
};

export default dashboardApi;
