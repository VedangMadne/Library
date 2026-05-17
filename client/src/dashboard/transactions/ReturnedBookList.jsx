import React, { useEffect, useState } from "react";
import {
  getAllReturnedBooks,
} from "../../http";

import Pagination from "../../components/dashboard/pagination/Pagination";
import { formatDate } from "../../utils/formatData";

const ReturnedBookList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const { data } = await getAllReturnedBooks(currentPage);
      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);



  return (
    <div className="manage__section bg">
      <div className="header">
        <h2>Returned Books</h2>
      </div>

      <div className="table__wrapper" style={{ overflow: "auto" }}>
        <table className="background__accent" cellSpacing="0" cellPadding="0">
          <thead className="bg__secondary">
            <tr>
              <td>ISBN</td>
              <td>Title</td>
              <td>First Name</td>
              <td>Last Name</td>
              <td>Roll Number/Email</td>
              <td>Returned Date</td>
            </tr>
          </thead>
          <tbody>
            {data?.books?.map((i) => {
              return (
                <tr key={i._id}>
                  <td>{i?.book?.ISBN}</td>
                  <td>{i.book?.title}</td>
                  <td>{i.user?.name}</td>
                  <td>{i.user?.lastName}</td>
                  <td>
                    {i.user?.role === "Teacher" ? (
                      <span>{i?.user?.email}</span>
                    ) : (
                      <span>{i?.user?.rollNumber}</span>
                    )}
                  </td>

                  <td>{formatDate(i?.updatedAt)}</td>
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
    </div>
  );
};

export default ReturnedBookList;
