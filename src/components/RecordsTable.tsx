import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getRecords, deleteOperation } from "../services/services";
import { UserContext } from "../context/UserContext";
import { Record } from "../interfaces/Record";

const RecordsTable: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 5;
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [sort, setSort] = useState<{ field: string; order: "ASC" | "DESC" }>({
    field: "id",
    order: "ASC",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const fetchRecords = async (page: number, perPage: number) => {
      try {
        const { data } = await getRecords(
          state.access_token!,
          page,
          perPage,
          sort
        );
        setRecords(data.records);
        setTotalRecords(data.totalRecords);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while fetching records.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords(currentPage, perPage);
  }, [state.access_token, currentPage, perPage, sort]);

  const handleSortChange = (field: string) => {
    setSort((prevSort) => ({
      field,
      order:
        prevSort.field === field && prevSort.order === "ASC" ? "DESC" : "ASC",
    }));
  };

  const renderSortArrow = (field: string) => {
    if (sort.field !== field) return "↕";
    return sort.order === "ASC" ? "↑" : "↓";
  };

  const handleDelete = async (record: Record) => {
    try {
      const { id, amount } = record;
      await deleteOperation(id, state.access_token!);
      setRecords(records.filter((record) => record.operation.id !== id));
      setTotalRecords(totalRecords - 1);
      const newBalance =
        parseFloat(state.balance!) + parseFloat(amount as unknown as string);
      dispatch({
        type: "UPDATE_BALANCE",
        payload: {
          username: state.username!,
          accessToken: state.access_token!,
          balance: newBalance.toString(),
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while deleting the record.");
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalRecords / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalRecords / perPage);
    return (
      <div className="btn-group" role="group" aria-label="Pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`btn btn-primary ${
              currentPage === i + 1 ? "active" : ""
            }`}
            onClick={() => handlePageClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecords = records.filter(
    (record) =>
      record.operation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.operation_response
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2>User Records</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th
                  className="sortable-header"
                  onClick={() => handleSortChange("id")}
                  title="Click to sort by ID"
                >
                  ID {renderSortArrow("id")}
                </th>
                <th>Operation</th>
                <th>Result</th>
                <th>Cost</th>
                <th
                  className="sortable-header"
                  onClick={() => handleSortChange("createdAt")}
                  title="Click to sort by CreatedAt"
                >
                  CreatedAt {renderSortArrow("createdAt")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords &&
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.operation.type}</td>
                    <td>{record.operation_response}</td>
                    <td>{record.amount}</td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(record)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <div className="d-flex justify-content-center">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link me-2"
                    onClick={handlePreviousPage}
                    style={{
                      background: "none",
                      color: "inherit",
                      textDecoration: "underline",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Previous
                  </button>
                </li>
                {renderPagination()}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(totalRecords / perPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="ms-2 page-link"
                    onClick={handleNextPage}
                    style={{
                      background: "none",
                      color: "inherit",
                      textDecoration: "underline",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default RecordsTable;
