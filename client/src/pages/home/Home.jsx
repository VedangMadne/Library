import "./home.scss";
import { Link } from "react-router-dom";
import principalImage from "../../assets/principal.jpg";
import { FaBook, FaLayerGroup, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { STATUSES, getHomePageData } from "../../http";
import Loader from "../../components/pages/loader/Loader";

const Home = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(STATUSES.IDLE);

  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getHomePageData();
      setData(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      setStatus(STATUSES.ERROR);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="bg text__color">
      <section className="hero "></section>

      <section className="welcome">
        <div className="left">
          <div className="heading">
            <h1>Welcome Message </h1>
          </div>
          <p>
            Welcome to the SES Library Management
            System..!
          </p>
          <p>
            Our modern, fully automated school library is undoubtedly a
            state-of-the-art Information Resource Center which fulfills
            ever-evolving needs of our academic clientele. We are dedicated to
            support the curriculum and educational mission of the school. The
            aim of the SES Library is to deliver the best print, digital and
            online information resources and reference services to support your
            teaching, learning, and research activities. We also provide
            conducive environment and wonderful spaces for research, study and
            collaboration.
          </p>
        </div>

        <div className="right">
          <img src={principalImage} alt="Principal Image" />
        </div>
      </section>

      <section className="counter__section">
        <div>
          <FaBook className="icon" />
          <h3>Total Books</h3>
          <p>{data?.totalBooks}</p>
        </div>

        <div>
          <FaUser className="icon" />
          <h3>Total Students </h3>
          <p>{data?.totalUsers}</p>
        </div>
        <div>
          <FaLayerGroup className="icon" />
          <h3>Total Categories</h3>
          <p>{data?.totalCategories}</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
