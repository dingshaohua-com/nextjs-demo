import axios from "axios";
import useSWR from "swr";
import type { PaginatedResponse, JsonServerQuery, ListResponse } from "json-server-client";
import { parseResponse } from "json-server-client";
interface User {
  id: number;
  name: string;
  gender: string;
  email: string;
}

// 分页
export const getUsersByPagination = async (
  params: JsonServerQuery<User>,
): Promise<PaginatedResponse<User>> => {
  const res = await axios.get("https://json.dingshaohua.com/users", { params });
  return res.data;
};

export const useGetUsersByPagination = (params: JsonServerQuery<User>) => {
  const key = {
    url: "https://json.dingshaohua.com/users",
    params,
  };
  return useSWR(key, () => getUsersByPagination(params));
};

// 不分页
export const getUsers = async (params: JsonServerQuery<User>): Promise<ListResponse<User>> => {
  const res = await axios.get("https://json.dingshaohua.com/users", { params });
  return parseResponse(res.data);
};

export const useGetUsers = (params: JsonServerQuery<User>) => {
  const key = {
    url: "https://json.dingshaohua.com/users",
    params,
  };
  return useSWR(key, () => getUsers(params));
};
