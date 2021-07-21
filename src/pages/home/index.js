import React, { useEffect, useState, useMemo } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import axios from "axios";
import InputSearch from "../../components/input_search";

function Home() {
  const [userPost, setUserPost] = useState({
    name: "",
    email: "",
    password: "",
  });

  const USER_COLUMN = [
    {
      Header: "Nama",
      accessor: "name",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Aksi",
      accessor: "id",
      disableFilters: true,
      Cell: (props) => {
        return (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => editUser(props.row.original)}
            >
              Edit
            </button>{" "}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteData(props.row.original.id)}
            >
              Hapus
            </button>
          </>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const columns = useMemo(() => USER_COLUMN, []);
  const defaultColumn = useMemo(() => {
    return {
      Filter: InputSearch,
    };
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    prepareRow,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const url = "http://localhost:8000/api/";

  const getData = () => {
    axios.get(`${url}user`).then((res) => {
      setData(res.data.data);
    });
  };

  const postData = () => {
    axios.post(`${url}post_user`, userPost).then(() => {
      getData();
      clearForm();
    });
  };

  const updateData = () => {
    axios.put(`${url}update_user/${userPost.id}`, userPost).then(() => {
      getData();
      clearForm();
      document.querySelector("#closeModal").click();
    });
  };

  const deleteData = (id) => {
    axios.delete(`${url}delete_user/${id}`, userPost).then(() => {
      getData();
    });
  };

  const editUser = (user) => {
    setUserPost({
      ...userPost,
      name: user.name,
      email: user.email,
      id: user.id,
    });
    console.log(userPost);
  };

  const clearForm = () => {
    setUserPost({
      ...userPost,
      name: "",
      email: "",
      password: "",
    });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUserPost({
      ...userPost,
      [name]: value,
    });
    console.log(userPost);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label>Nama</label>
                <input
                  className="form-control"
                  name="name"
                  type="text"
                  value={userPost.name}
                  onChange={(e) => inputChange(e)}
                />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={userPost.email}
                  onChange={(e) => inputChange(e)}
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  className="form-control"
                  name="password"
                  type="password"
                  value={userPost.password}
                  onChange={(e) => inputChange(e)}
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={postData}
                  className="btn btn-primary"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    Edit User
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Nama</label>
                    <input
                      className="form-control"
                      name="name"
                      type="text"
                      value={userPost.name}
                      onChange={(e) => inputChange(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={userPost.email}
                      onChange={(e) => inputChange(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                      value={userPost.password}
                      onChange={(e) => inputChange(e)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    id="closeModal"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearForm}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={updateData}
                    className="btn btn-primary"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mt-3">
            <div className="card-body">
              <div className="form-inline">
                Tampilkan Data&nbsp;
                <select
                  className="custom-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <table className="table table-striped" {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          &nbsp;
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <i className="fas fa-caret-down"></i>
                            ) : (
                              <i className="fas fa-caret-up"></i>
                            )
                          ) : (
                            ""
                          )}
                          <div>
                            {column.canFilter ? column.render("Filter") : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="row mt-0">
                <div class="form-inline ml-4">
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>
                  | Go to page :&nbsp;
                  <input
                    className="form-control"
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const pageNumber = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(pageNumber);
                    }}
                  />
                </div>
                <nav className="ml-auto mr-4 mt-4">
                  <ul className="pagination">
                    <li className="page-item">
                      <button className="page-link" onClick={() => gotoPage(0)}>
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                      >
                        Previous
                      </button>
                    </li>
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                      >
                        Next
                      </button>
                    </li>
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => gotoPage(pageCount - 1)}
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
