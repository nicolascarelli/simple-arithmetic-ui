import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { createOperation } from "../services/services";
import { OperationType } from "../helpers/OperationType";

const NewOperationForm: React.FC = () => {
  const [operation, setOperation] = useState(OperationType.ADDITION);
  const [input1, setInput1] = useState<number | null>(null);
  const [input2, setInput2] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { dispatch, state } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const expression: { type: OperationType; args?: number[] } = {
      type: operation,
    };

    if (input1 !== null) {
      expression.args = [input1];
      if (input2 !== null) {
        expression.args.push(input2);
      }
    }

    try {
      const { data } = await createOperation(expression, state.access_token!);
      setResult(data.operation_response);
      console.log(data.user_balance);
      dispatch({
        type: "UPDATE_BALANCE",
        payload: {
          username: state.username!,
          accessToken: state.access_token!,
          balance: data.user_balance,
        },
      });
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError(
          (error as Error).message || "An error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>New Operation</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Operation</label>
              <select
                className="form-select"
                value={operation}
                onChange={(e) => setOperation(e.target.value as OperationType)}
              >
                {Object.values(OperationType).map((operation) => (
                  <option key={operation} value={operation}>
                    {operation.charAt(0).toUpperCase() +
                      operation.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            {operation !== OperationType.RANDOM_STRING && (
              <div className="mb-3">
                <label className="form-label">Input 1</label>
                <input
                  className="form-control"
                  type="number"
                  value={input1 ?? ""}
                  onChange={(e) => setInput1(Number(e.target.value))}
                  required
                />
              </div>
            )}
            {operation !== OperationType.SQUARE_ROOT &&
              operation !== OperationType.RANDOM_STRING && (
                <div className="mb-3">
                  <label className="form-label">Input 2</label>
                  <input
                    className="form-control"
                    disabled={input1 === null}
                    type="number"
                    value={input2 ?? ""}
                    onChange={(e) => setInput2(Number(e.target.value))}
                    required
                  />
                </div>
              )}
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
          {result && (
            <div className="alert alert-success mt-3">Result: {result}</div>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default NewOperationForm;
