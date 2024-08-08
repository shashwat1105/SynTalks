
import axios from 'axios';
import { HOST } from '@/utils/constants';

const apiClient=axios.create({
baseURL:HOST || 'http://localhost:3001',
})

export default apiClient;