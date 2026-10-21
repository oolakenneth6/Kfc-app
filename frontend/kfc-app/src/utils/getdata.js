import api from "./api";

export const getdata = async (url) => {
  const res = await api.get(url);
  return res.data;
};
