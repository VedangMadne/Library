import React, { useEffect, useState } from "react";
import {
  BASE_URL,
  addNewStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "../../http";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Modal from "../../components/dashboard/modal/Modal";
import Pagination from "../../components/dashboard/pagination/Pagination";

const ManageStudent = () => {
  const [query, setQuery] = useState({
    name: "",
    rollNumber: "",
    lastName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);

  const initialState = {
    _id: "",
    name: "",
    middleName: "",
    lastName: "",
    rollNumber: "",
    class: "",
    division: "",
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
    const promise = addNewStudent({
      name: formData.name,
      middleName: formData.middleName,
      lastName: formData.lastName,
      rollNumber: formData.rollNumber,
      class: formData.class,
      division: formData.division,
    });
    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        setFormData(initialState);
        fetchData();
        setShowAddNewModel(false);
        return "Student added successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const confirmDelete = () => {
    if (!studentIdToDelete) return;
    const promise = deleteStudent(studentIdToDelete);
    toast.promise(promise, {
      loading: "Deleting...",
      success: () => {
        fetchData();
        setShowDeleteModal(false);
        setStudentIdToDelete(null);
        return "Student deleted successfully.";
      },
      error: (err) => {
        setShowDeleteModal(false);
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateStudent(formData?._id, {
      name: formData.name,
      middleName: formData.middleName,
      lastName: formData.lastName,
      rollNumber: formData.rollNumber,
      class: formData.class,
      division: formData.division,
      accountStatus: formData.accountStatus,
    });
    toast.promise(promise, {
      loading: "Updating...",
      success: () => {
        setFormData(initialState);
        fetchData();
        setShowUpdateModel(false);
        return "Student updated successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllStudents(
        query.name,
        query.lastName,
        query.rollNumber,
        currentPage
      );
      console.log(data);
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
        <h2>Manage Students</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            Add New Student
          </button>
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Search by roll number...."
          className="background__accent text"
          value={query.rollNumber}
          onChange={(e) => {
            setQuery({ ...query, rollNumber: e.target.value });
          }}
        />
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

        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery({ name: "", rollNumber: "", lastName: "" });
          }}
        >
          CLEAR
        </button>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>Roll Number</td>
              <td>First Name</td>
              <td>Middle Name</td>
              <td>Last Name</td>
              <td>Class</td>
              <td>Division</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.students?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i.rollNumber}</td>
                  <td>{i.name}</td>
                  <td>{i.middleName}</td>
                  <td>{i.lastName}</td>
                  <td>{i.class.class}</td>
                  <td>{i.division.name}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn__warning"
                        onClick={() => {
                          setFormData({
                            _id: i._id,
                            name: i.name,
                            middleName: i.middleName,
                            lastName: i.lastName,
                            rollNumber: i.rollNumber?.split("-")[1] || "",
                            class: i.class._id,
                            division: i.division._id,
                          });
                          setShowUpdateModel(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn__danger"
                        onClick={() => {
                          setStudentIdToDelete(i._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
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
        title="ADD NEW STUDENT"
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
            <label htmlFor="middleName">Middle Name</label>
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
            <label htmlFor="class">Class</label>
            <select
              name="class"
              id="class"
              className="bg text__color"
              value={formData.class}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {data?.classes?.map((std) => {
                return (
                  <option key={std._id} value={std._id}>
                    {std.class}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="division">Division</label>
            <select
              name="division"
              id="division"
              className="bg text__color"
              value={formData.division}
              onChange={handleChange}
              required
            >
              <option value="">Select Division</option>
              {data?.divisions?.map((div) => {
                return (
                  <option key={div._id} value={div._id}>
                    {div.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              type="text"
              placeholder="Enter roll number"
              name="rollNumber"
              className="bg text__color"
              value={formData.rollNumber}
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
        title="UPDATE STUDENT"
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
            <label htmlFor="middleName">Middle Name</label>
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
            <label htmlFor="class">Class</label>
            <select
              name="class"
              id="class"
              className="bg text__color"
              value={formData.class}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {data?.classes?.map((std) => {
                return (
                  <option key={std._id} value={std._id}>
                    {std.class}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="division">Division</label>
            <select
              name="division"
              id="division"
              className="bg text__color"
              value={formData.division}
              onChange={handleChange}
              required
            >
              <option value="">Select Division</option>
              {data?.divisions?.map((div) => {
                return (
                  <option key={div._id} value={div._id}>
                    {div.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="fatherName">Roll Number</label>
            <input
              type="text"
              placeholder="Enter roll number"
              name="rollNumber"
              className="bg text__color"
              value={formData.rollNumber}
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
          Are you sure you want to delete this student?
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

export default ManageStudent;
