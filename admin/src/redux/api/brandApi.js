import axios from "../../utils/axiosInstance";

const BRAND_API = "/brands";

export const getBrands = () => axios.get(BRAND_API);
export const getBrandById = (id) => axios.get(`${BRAND_API}/${id}`);
export const createBrand = (data) => axios.post(BRAND_API, data);
export const updateBrand = (id, data) => axios.put(`${BRAND_API}/${id}`, data);
export const deleteBrand = (id) => axios.delete(`${BRAND_API}/${id}`);

// 🟩 DEFAULT EXPORT (required)
export default {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
