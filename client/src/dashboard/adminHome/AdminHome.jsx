import "./adminhome.scss";
import { useEffect, useState } from "react";
import { STATUSES, getAdminDashboardStats, storeBackupData } from "../../http";
import BarChart from "../../components/dashboard/barchart/BarChart";
import CountCard from "../../components/dashboard/countCard/CountCard";
import PieChart from "../../components/dashboard/piechart/PieChart";
import toast from "react-hot-toast";

const AdminHome = () => {
  const [status, setStatus] = useState(STATUSES.IDLE);
  const [data, setData] = useState(null);

  const handleExport = () => {
    const promise = storeBackupData();

    toast.promise(promise, {
      loading: "Storing data backup. Please wait...",
      success: (response) => {
        return response.data.message;
      },
      error: (err) => {
        console.error(err);
        return "Failed to store data backup. Please try again.";
      },
    });
  };


  const fetchData = async () => {
    setStatus(STATUSES.LOADING);
    try {
      const { data } = await getAdminDashboardStats();
      setData(data);
      setStatus(STATUSES.IDLE);
    } catch (error) {
      console.log(error);
      setStatus(STATUSES.ERROR);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

 

  return status && (
    <div className="admin__home__container">
      <div className="export__button__wrapper">
        <button className="btn btn__secondary" onClick={handleExport}>
          Store Data Backup
        </button>
      </div>

      {/* COUNTER CARDS */}
      <div className="card__wrapper">
        <CountCard
          heading={"Total Books"}
          count={data?.numberOfTotalBooks}
          link={"manage-books"}
        />
        <CountCard
          heading={"Issued Books"}
          count={data?.numberOfBorrowedBooks}
          link={"manage-issued-books"}
        />
        <CountCard
          heading={"Returned Books"}
          count={data?.numberOfReturnedBooks}
          link={"returned-books-list"}
        />
      </div>

      {/* BAR AND PIE CHART */}
      <div className="chart__wrapper">
        <div className="barchart__container">
          <BarChart
            title="NUMBER OF BORROWED BOOKS CHART"
            labels={
              data?.last12MonthsData &&
              Object.keys(data?.last12MonthsData).reverse()
            }
            values={
              data?.last12MonthsData &&
              Object.values(data?.last12MonthsData).reverse()
            }
            label="BORROWED BOOKS"
          />
        </div>
        <div className="piechart__container">
          <PieChart
            labels={data?.statusCounts && Object.keys(data?.statusCounts)}
            values={data?.statusCounts && Object.values(data?.statusCounts)}
            title={"BOOK STATUS  CHART"}
            label="STATUS"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
