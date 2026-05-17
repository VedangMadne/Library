import React, { useEffect, useState } from "react";
import {
  addNewAlmirah,
  deleteAlmirah,
  exportAlmirahs,
  getAllAlmirahs,
  updateAlmirah,
} from "../../http";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Modal from "../../components/dashboard/modal/Modal";
import Pagination from "../../components/dashboard/pagination/Pagination";

const ManageAlmirah = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showAddNewModel, setShowAddNewModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [almirahIdToDelete, setAlmirahIdToDelete] = useState(null);

  const initialState = {
    _id: "",
    subject: "",
    number: "",
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
    const promise = addNewAlmirah({
      subject: formData.subject,
      number: formData.number,
    });
    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        setFormData(initialState);
        fetchAlmirahs();
        setShowAddNewModel(false);
        return "Almirah added successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const confirmDelete = () => {
    if (!almirahIdToDelete) return;
    const promise = deleteAlmirah(almirahIdToDelete);
    toast.promise(promise, {
      loading: "Deleting...",
      success: () => {
        fetchAlmirahs();
        setShowDeleteModal(false);
        setAlmirahIdToDelete(null);
        return "Almirah deleted successfully.";
      },
      error: (err) => {
        setShowDeleteModal(false);
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const promise = updateAlmirah(formData?._id, {
      subject: formData.subject,
      number: formData.number,
    });
    toast.promise(promise, {
      loading: "Updating...",
      success: () => {
        setFormData(initialState);
        fetchAlmirahs();
        setShowUpdateModel(false);
        return "Almirah updated successfully..";
      },
      error: (err) => {
        console.log(err);
        return err?.response?.data?.message || "Something went wrong !";
      },
    });
  };

  const handleExport = () => {
    const promise = exportAlmirahs();
    toast.promise(promise, {
      loading: "Exporting",
      success: (response) => {
        window.open(response?.data?.downloadUrl);
        return "Exported successfully";
      },
      error: (err) => {
        console.log(err);
        return "Something went wrong while exporting data.";
      },
    });
  };

  const fetchAlmirahs = async () => {
    try {
      const { data } = await getAllAlmirahs(query, currentPage);
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
      fetchAlmirahs();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    fetchAlmirahs();
  }, [currentPage]);

  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Manage Almirahs</h2>
        <div>
          <button
            className="btn btn__secondary"
            onClick={() => {
              setShowAddNewModel(true);
            }}
          >
            Add New Almirah
          </button>
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Search almirahs...."
          className="background__accent text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery("");
          }}
        >
          CLEAR
        </button>
      </div>

      <div className="table__wrapper">
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ID</td>
              <td>Subject</td>
              <td>Number</td>
              <td>Book Count</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.almirahs?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i._id}</td>
                  <td>{i.subject}</td>
                  <td>{i.number}</td>
                  <td>{i.bookCount}</td>
                  <td>
                    <button
                      className="btn btn__warning"
                      onClick={() => {
                        setFormData({
                          subject: i.subject,
                          number: i.number,
                          _id: i._id,
                        });
                        setShowUpdateModel(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn__danger"
                      onClick={() => {
                        setAlmirahIdToDelete(i._id);
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
        title="ADD NEW ALMIRAH"
        show={showAddNewModel}
        onClose={handleCloseAddNewModel}
      >
        <form onSubmit={handleAddNew}>
          <div className="form-control">
            <label htmlFor="subject">Almirah Subject</label>
            <input
              type="text"
              placeholder="Enter almirah subject"
              name="subject"
              className="bg text__color"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="number">Almirah Number</label>
            <input
              type="text"
              placeholder="Enter almirah number"
              name="number"
              className="bg text__color"
              value={formData.number}
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
        title="UPDATE ALMIRAH"
        show={showUpdateModel}
        onClose={handleCloseUpdateModel}
      >
        <form onSubmit={handleUpdate}>
          <div className="form-control">
            <label htmlFor="subject">Almirah Subject</label>
            <input
              type="text"
              placeholder="Enter almirah subject"
              name="subject"
              className="bg text__color"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="number">Almirah Number</label>
            <input
              type="text"
              placeholder="Enter almirah number"
              name="number"
              className="bg text__color"
              value={formData.number}
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
          Are you sure you want to delete this almirah?
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

export default ManageAlmirah;
