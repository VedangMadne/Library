import { Link } from "react-router-dom";
import "./footer.scss";
import { GiBookAura } from "react-icons/gi";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg__accent text__color">
      <div className="top">
        <div className="box1">
          <div className="logo text__primary">
            <GiBookAura className="icon" />
            <h4>Sharda English School Library</h4>
          </div>
          <p style={{ marginTop: "8px", lineHeight: "1.5rem" }}>
            Gateway to knowledge, discovery, and lifelong learning for all SES
            students, faculty, and staff. A welcoming and inclusive space for
            all learners to come together and learn.
          </p>
        </div>
        <div className="box2">
          <h4>Navigate</h4>
          <Link to="/" className="text__color">
            Home
          </Link>
          <Link to="/about-us" className="text__color">
            About Us
          </Link>{" "}
          <Link to="/books" className="text__color">
            Books
          </Link>
          <Link to="/login" className="text__color">
            Login
          </Link>
        </div>

        <div className="box3">
          <h4>Contact</h4>
          <div className="item">
            <FiMapPin className="icon__home" />
            <span>
              Sharda English School, Kaij, Taluka Kaij, Dist Beed, Maharashtra -
              431123
            </span>
          </div>
          <div className="item">
            <AiOutlineMail className="icon" />
            <span>ses.kaij@gamil.com</span>
          </div>
          <div className="item">
            <AiOutlinePhone className="icon" />
            <span>+91-9420386282</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <span>
          &copy;2025 Copyright : Sharda English School library, Kaij. All rights
          reserved | Design & Develop by: Basavraj Birajdar.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
