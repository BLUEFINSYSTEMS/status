import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css'
import 'animate.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Monitors = () => {
  const [monitor, setMonitor] = useState("");
  const [serverDateTime, setServerDateTime] = useState(""); // Use setServerDateTime to update the state

  const getData = async () => {
    try {
      const apiKey = import.meta.env.KEY
      console.log(apiKey)
      console.log("Fetching data from endpoint");
      const res = await axios.get("http://127.0.0.1:3000/monitors", {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      if (res.status === 200) {
        console.log(res);
        setMonitor(res);
      } else {
        setMonitor(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateServerTime = () => {
    const melbourneTimezoneOffset = 10; // Melbourne is UTC+10 during standard time
    const now = new Date();
    
    const melbourneTime = new Date(now.getTime() + (melbourneTimezoneOffset * 60 * 60 * 1000));
    
    const month = (melbourneTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = melbourneTime.getUTCDate().toString().padStart(2, '0');
    const year = melbourneTime.getUTCFullYear().toString().slice(-2); // Get last two digits of the year
    
    const hours = melbourneTime.getUTCHours().toString().padStart(2, '0');
    const minutes = melbourneTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = melbourneTime.getUTCSeconds().toString().padStart(2, '0');
    
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    
    setServerDateTime(formattedDateTime);
  }

  useEffect(() => {
    getData();
    updateServerTime();
    
    const intervalId = setInterval(updateServerTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header>
        <div className="content animate__animated animate__fadeIn">
          <div className="row">
            <div className="col-md-6">
              <h2>mission control</h2>
              <h3>all systems operational</h3>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <div className="text-end mt-5">
                <p className="text-white">SERVER TIME</p>
                <h4 className="text-white text-bold">{serverDateTime}</h4>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="content">
        {monitor ? (
          monitor.data.data.map((item, index) => (
            <div className="container" key={index}>
              <div className="row">
                <div className="col-md-6">
                  <h4><span className="bi bi-wordpress"> {item.attributes.pronounceable_name} </span></h4>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  {item.attributes.status === "up" && <p className="text-online">ONLINE</p> 
                  || item.attributes.status === "down" && <p className="text-offline">OFFLINE</p>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="content">
            <div className="container d-flex">
              <h2 className="text-center">Loading...</h2>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Monitors;
