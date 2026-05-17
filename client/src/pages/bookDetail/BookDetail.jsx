import React, { useEffect, useState } from "react";
import image from "../../assets/cover404.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, getBook, STATUSES } from "../../http";
import { useSelector } from "react-redux";

const BookDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const [book, setBook] = useState();
  const [status, setStatus] = useState(STATUSES.IDLE);
  const { _id } = useParams();
  const navigate = useNavigate();

  const fetchBook = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getBook(_id);
      setBook(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.log(error);
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (status === STATUSES.LOADING) {
    return <div className="">Loading....</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div className="alert alert__danger">Something went wrong</div>;
  }

  return (
    <div className="book__detail bg text__color">
      <button
        className="btn btn__secondary"
        style={{ marginBottom: "10px" }}
        onClick={() => {
          navigate(-1);
        }}
      >
        Go Back
      </button>

      <div className="book__container">
        <div className="image">
          <img
            src={book?.imagePath ? book.imagePath : image}
            alt="book image"
          />
        </div>
        <div className="content">
          <h2>{book?.title}</h2>
          <p>ISBN is {book?.ISBN}</p>
          <p>By {book?.author}</p>

          <p style={{ display: "flex", columnGap: "5px" }}>
            <span>Status : </span>{" "}
            <span
              className={`badge ${
                book?.status === "Available"
                  ? "badge__success"
                  : book?.status === "Issued"
                  ? "badge__danger"
                  : book?.status === "Reserved"
                  ? "badge__warning"
                  : "badge__info"
              }`}
            >
              {book?.status}
            </span>
          </p>
          <p>
            <span>Category : </span>
            {book?.category?.name}
          </p>
          {user?.role === "Admin" && (
            <p>
              <span>Almirah :</span> {book?.almirah?.number} (
              {book?.almirah?.subject})
            </p>
          )}
          <p>
            <span>Edition : </span>
            {book?.edition}
          </p>
          <p>
            <span>Publisher : </span>
            {book?.publisher}
          </p>
          <p>
            <span>Description :</span>
            {book?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
