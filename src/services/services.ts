import axios from "axios";
import { OperationType } from "../helpers/OperationType";
import { Record } from "../interfaces/Record";

const apiUrl = process.env.REACT_APP_API_URL;

export const login = async (username: string, password: string) => {
  return await axios.post(`${apiUrl}/v1/auth/login`, {
    username,
    password,
  });
};

export const createOperation = async (
  expression: { type: OperationType; args?: number[] },
  accessToken: string
) => {
  const { type, args } = expression;
  return await axios.post(
    `${apiUrl}/v1/operations`,
    {
      type,
      args,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const getRecords = async (
  accessToken: string,
  page: number = 1,
  perPage: number = 5,
  sort: { field: string; order: 'ASC' | 'DESC' } = {
    field: 'id',
    order: 'ASC',
  }
): Promise<{ data: { records: Record[], totalRecords: number} }> => {
  return await axios.get(`${apiUrl}/v1/records`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      perPage,
      sortField: sort.field,
      sortOrder: sort.order,
    },
  });
};

export const deleteOperation = async (id: number, accessToken: string) => {
  return await axios.delete(`${apiUrl}/v1/operations/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
