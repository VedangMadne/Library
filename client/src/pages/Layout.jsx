import { Outlet } from "react-router-dom";
import Header from "../components/pages/header/Header";
import Footer from "../components/pages/footer/Footer";

const Layout = () => {
  return (
    <div className="bg">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
