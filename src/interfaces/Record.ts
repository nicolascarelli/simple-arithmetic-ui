import { OperationType } from "../helpers/OperationType";

export interface Record {
    id: number;
    username: string;
    operation: {
        type: OperationType;
        id: number;
    }
    operation_response: string | number;
    amount: number;
    user_balance: number;
    createdAt: string;
  }