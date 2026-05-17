import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/Layout";
import Home from "./pages/home/Home";
import Books from "./pages/books/Books";
import AboutUs from "./pages/aboutUs/AboutUs";
import BookDetail from "./pages/bookDetail/BookDetail";
import Login from "./pages/login/Login";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "./dashboard/adminLayout/AdminLayout";
import AdminHome from "./dashboard/adminHome/AdminHome";
import ManageTeacher from "./dashboard/manageEntities/ManageTeacher";
import ManageStudent from "./dashboard/manageEntities/ManageStudent";
import ManageBook from "./dashboard/manageEntities/ManageBook";
import UserDetail from "./dashboard/userDetail/UserDetail";
import AddNewBook from "./dashboard/manageEntities/AddNewBook";
import UpdateBook from "./dashboard/manageEntities/UpdateBook";
import ManageCategory from "./dashboard/manageEntities/ManageCategory";
import ManageAlmirah from "./dashboard/manageEntities/ManageAlmirah";
import ManageIssueBooks from "./dashboard/transactions/ManageIssuedBooks";
import IssueBook from "./dashboard/transactions/IssueBook";
import Profile from "./dashboard/profile/Profile";
import ChangePassword from "./dashboard/changepassword/ChangePassword";
import ReturnedBookList from "./dashboard/transactions/ReturnedBookList";
import { refreshTokens, STATUSES } from "./http";
import { setAuth } from "./store/slices/authSlice";
import Loader from "./components/pages/loader/Loader";


function App() {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(STATUSES.IDLE);

  useEffect(() => {
    (async () => {
      try {
        setStatus(STATUSES.LOADING);
        const { data } = await refreshTokens();
        dispatch(setAuth(data));
        setStatus(STATUSES.IDLE);
      } catch (error) {
        setStatus(STATUSES.ERROR);
      }
    })();
  }, []);

  if (status === STATUSES.LOADING) {
    return <Loader />;
  }

  return (
    <div className={`${theme}`}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="books/:_id" element={<BookDetail />} />
        </Route>

        <Route path="/admin" element={<AdminProtectedRoutes />}>
          <Route path="dashboard" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="manage-teachers" element={<ManageTeacher />} />
            <Route path="manage-students" element={<ManageStudent />} />
            <Route path="manage-books" element={<ManageBook />} />
            <Route path="user-details/:_id" element={<UserDetail />} />
            <Route path="book-details/:_id" element={<BookDetail />} />
            <Route path="add-new-book" element={<AddNewBook />} />
            <Route path="update-book/:_id" element={<UpdateBook />} />
            <Route path="manage-categories" element={<ManageCategory />} />
            <Route path="manage-almirahs" element={<ManageAlmirah />} />
            <Route path="manage-issued-books" element={<ManageIssueBooks />} />
            <Route path="issue-book" element={<IssueBook />} />
            <Route path="returned-books-list" element={<ReturnedBookList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        <Route path="/login">
          <Route index element={<Login />} />
        </Route>
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;

export const AdminProtectedRoutes = () => {
  const auth = useSelector((state) => state.auth);
  return auth?.isAuth && auth.user?.role === "Admin" && (
    <Outlet />
  ) 
};

