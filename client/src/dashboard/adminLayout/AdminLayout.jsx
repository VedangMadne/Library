import React from "react";
import { MdCancel, MdDashboard, MdPendingActions } from "react-icons/md";
import {
  FaBook,
  FaList,
  FaLock,
  FaUserAlt,
  FaUsers,
  FaBookOpen,
} from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import { BiCategoryAlt } from "react-icons/bi";
import { SiBookstack } from "react-icons/si";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AiFillBell, AiFillMessage } from "react-icons/ai";
import SideBar from "../../components/dashboard/sidebar/SideBar";
import AppBar from "../../components/dashboard/appbar/AppBar";

const menu = [
  {
    id: 1,
    title: "Core",
    listItems: [
      {
        id: 1,
        text: "Dashbaord",
        link: "/admin/dashboard",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    id: 2,
    title: "Transaction",
    listItems: [
      {
        id: 1,
        text: "Issued Books",
        link: "manage-issued-books",
        icon: <SiBookstack />,
      },
      {
        id: 2,
        text: "Returned Books",
        link: "returned-books-list",
        icon: <SiBookstack />,
      },
    ],
  },
  {
    id: 3,
    title: "Users",
    listItems: [
      {
        id: 1,
        text: "Students",
        link: "manage-students",
        icon: <FaUsers />,
      },
      {
        id: 2,
        text: "Teachers",
        link: "manage-teachers",
        icon: <FaUsers />,
      },
    ],
  },
  {
    id: 4,
    title: "Books",
    listItems: [
      {
        id: 1,
        text: "Books",
        link: "manage-books",
        icon: <FaBook />,
      },
      {
        id: 2,
        text: "Categories",
        link: "manage-categories",
        icon: <BiCategoryAlt />,
      },
      {
        id: 3,
        text: "Almirahs",
        link: "manage-almirahs",
        icon: <FaList />,
      },
    ],
  },

  {
    id: 5,
    title: "Account",
    listItems: [
      {
        id: 1,
        text: "Profile",
        link: "profile",
        icon: <FaUserAlt />,
      },
      {
        id: 2,
        text: "Change Password",
        link: "change-password",
        icon: <FaLock />,
      },
    ],
  },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="dashboard__layout">
      <SideBar menu={menu} open={open} setOpen={setOpen} />
      <div className="container bg">
        <AppBar open={open} setOpen={setOpen} />
        <main className="bg text__color">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
