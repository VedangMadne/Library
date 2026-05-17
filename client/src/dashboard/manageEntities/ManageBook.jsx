import React, { useEffect, useState } from "react";
import {
  deleteBook,
  getAllBooks,
  getCategories,
} from "../../http";

import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../components/dashboard/pagination/Pagination";
import Modal from "../../components/dashboard/modal/Modal";

const ManageBook = () => {
  const [query, setQuery] = useState({
    ISBN: "",
    title: "",
    status: "",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const confirmDelete = () => {
    if (!bookIdToDelete) return;
    const promise = deleteBook(bookIdToDelete);
    toast.promise(promise, {
      loading: "Deleting...",
      success: () => {
        fetchData();
        setShowDeleteModal(false);
        setBookIdToDelete(null);
        return "Book deleted successfully.";
      },
      error: (err) => {
        setShowDeleteModal(false);
        return err?.response?.data?.message || "Something went wrong!";
      },
    });
  };

  const fetchData = async () => {
    try {
      const { data } = await getAllBooks(query, currentPage);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    setCurrentPage(1);
    // debouncing
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
        <h2>Manage Books</h2>
        <div>
          <button className="btn btn__secondary">
            <Link
              to="/admin/dashboard/add-new-book"
              style={{ textDecoration: "none", color: "white" }}
            >
              Add New Book
            </Link>
          </button>
        </div>
      </div>

      <div className="filter">
        <input
          type="text"
          placeholder="Search by ISBN...."
          className="background__accent text"
          value={query.ISBN}
          onChange={(e) => {
            setQuery({ ...query, ISBN: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Search by title...."
          className="background__accent text"
          value={query.title}
          onChange={(e) => {
            setQuery({ ...query, title: e.target.value });
          }}
        />
        <select
          value={query.category}
          onChange={(e) => {
            setQuery({ ...query, category: e.target.value });
            setCurrentPage(1);
          }}
          className="bg__accent text__color"
        >
          <option value="">Filter by Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={query.status}
          onChange={(e) => {
            setQuery({ ...query, status: e.target.value });
            setCurrentPage(1);
          }}
          className="bg__accent text__color"
        >
          <option value="">Filter by Status</option>
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
        <button
          className="btn btn__primary"
          onClick={() => {
            setQuery({ title: "", ISBN: "", category: "", status: "" });
          }}
        >
          CLEAR
        </button>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ISBN</td>
              <td>Title</td>
              <td>Author</td>
              <td>Category</td>
              <td>Status</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {data?.books?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i.ISBN}</td>
                  <td>{i.title}</td>
                  <td>{i.author}</td>
                  <td>{i?.category?.name}</td>

                  <td>
                    <span
                      className={`badge ${
                        i.status === "Available"
                          ? "badge__success"
                          : i.status === "Issued"
                          ? "badge__danger"
                          : i.status === "Reserved"
                          ? "badge__warning"
                          : "badge__info"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => {
                          navigate(`/admin/dashboard/book-details/${i._id}`);
                        }}
                        className="btn btn__success"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn__warning"
                        onClick={() => {
                          navigate(`/admin/dashboard/update-book/${i._id}`);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn__danger"
                        onClick={() => {
                          setBookIdToDelete(i._id);
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
        title="CONFIRM DELETE"
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <p style={{ marginTop: "30px", marginBottom: "10px" }}>
          Are you sure you want to delete this book?
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

export default ManageBook;
