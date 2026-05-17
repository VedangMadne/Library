import React, { useEffect, useState } from "react";
import {
  addNewTeacher,
  deleteTeacher,
  getAllTeachers,
  updateTeacher,
} from "../../http";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Modal from "../../components/dashboard/modal/Modal";
import Pagination from "../../components/dashboard/pagination/Pagination";

const ManageTeacher = () => {
  const [query, setQuery] = useState({ email: "", name: "", lastName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherIdToDelete, setTeacherIdToDelete] = useState(null);

  const initialState = {
    _id: "",
    name: "",
    middleName: "",
    lastName: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseAddNewModel = () => {
    setShowAddNewModel(false);
    setFormData(initialState);
  };

  const handleCloseUpdateModel = () => {
    setShowUpdateModel(false);
    setFormData(initialState);
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    const promise = addNewTeacher({
      name: formData.name,
      middleName: formData.middleName,
      lastName: formData.lastName,
      email: formData.email,
    });
    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        setFormData(initialState);
        fetchData();
        setShowAddNewModel(false);
        return "Teacher added successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const confirmDelete = () => {
    if (!teacherIdToDelete) return;
    const promise = deleteTeacher(teacherIdToDelete);
    toast.promise(promise, {
      loading: "Deleting...",
      success: () => {
        fetchData();
        setShowDeleteModal(false);
        setTeacherIdToDelete(null);
        return "Teacher deleted successfully.";
      },
      error: (err) => {
        setShowDeleteModal(false);
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateTeacher(formData?._id, {
      name: formData.name,
      middleName: formData.middleName,
      lastName: formData.lastName,
      email: formData.email,
    });
    toast.promise(promise, {
      loading: "Updating...",
      success: () => {
        setFormData(initialState);
        fetchData();
        setShowUpdateModel(false);
        return "Teacher updated successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllTeachers(
        query.email,
        query.name,
        query.lastName,
        currentPage
      );
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setCurrentPage(1);
    const handler = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Manage Teachers</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            Add New TEACHER
          </button>
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Search by first name...."
          className="background__accent text"
          value={query.name}
          onChange={(e) => {
            setQuery({ ...query, name: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Search by last name...."
          className="background__accent text"
          value={query.lastName}
          onChange={(e) => {
            setQuery({ ...query, lastName: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Search by email...."
          className="background__accent text"
          value={query.email}
          onChange={(e) => {
            setQuery({ ...query, email: e.target.value });
          }}
        />
        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery({ email: "", name: "", lastName: "" });
          }}
        >
          CLEAR
        </button>
      </div>

      <div className="table__wrapper">
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>First Name</td>
              <td>Middle Name</td>
              <td>Last Name</td>
              <td>Email</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.teachers?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i.name}</td>
                  <td>{i.middleName}</td>
                  <td>{i.lastName}</td>
                  <td>{i.email}</td>
                  <td>
                    <button
                      className="btn btn__warning"
                      onClick={() => {
                        setFormData({
                          _id: i._id,
                          name: i.name,
                          middleName: i.middleName,
                          lastName: i.lastName,
                          email: i.email,
                        });
                        setShowUpdateModel(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn__danger"
                      onClick={() => {
                        setTeacherIdToDelete(i._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        data={data}
      />

      <Modal
        title="ADD NEW TEACHER"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="name">Middle Name</label>
            <input
              type="text"
              placeholder="Enter middle name"
              name="middleName"
              className="bg text__color"
              value={formData.middleName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              name="lastName"
              className="bg text__color"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              className="bg text__color"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseAddNewModel}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn__success">
              SUBMIT
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="UPDATE TEACHER"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              name="name"
              className="bg text__color"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="name">Middle Name</label>
            <input
              type="text"
              placeholder="Enter middle name"
              name="middleName"
              className="bg text__color"
              value={formData.middleName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              name="lastName"
              className="bg text__color"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              className="bg text__color"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="actions">
            <button
              className="btn btn__danger"
              type="button"
              onClick={handleCloseUpdateModel}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn__success">
              UPDATE
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="CONFIRM DELETE"
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <p style={{ marginTop: "30px", marginBottom: "10px" }}>
          Are you sure you want to delete this teacher?
        </p>
        <p style={{ fontSize: "15px", color: "#555" }}>
          This action is irreversible and the data will be permanently removed.
        </p>
        <div className="actions" style={{ marginTop: "70px" }}>
          <button className="btn btn__danger" onClick={confirmDelete}>
            YES, DELETE
          </button>
          <button
            className="btn btn__secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            CANCEL
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTeacher;
