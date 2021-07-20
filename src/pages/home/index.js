import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [userPost, setUserPost] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState([]);

  const url = "http://localhost:8000/api/";

  const getData = () => {
    axios.get(`${url}user`).then((res) => {
      setUser(res.data.data);
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

          <div className="card mt-3">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((row, index) => (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>
                        <button
                          onClick={() => editUser(row)}
                          className="btn btn-primary btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                        >
                          Edit
                        </button>
                        &nbsp;
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteData(row.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>
    </div>
  );
}

export default Home;
