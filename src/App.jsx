import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css'
import './fonts.css';
import 'animate.css';
import axios from 'axios';
import { useEffect, useState } from 'react';


const Monitors = () => {
  const [monitor, setMonitor] = useState("");
  const [serverDateTime, setServerDateTime] = useState("");

  const getData = async () => {
    try {
      const apiKey = import.meta.env.KEY
      console.log(apiKey)
      console.log("Fetching data from endpoint");
      const res = await axios.get("http://127.0.0.1:3000/api/monitors", {
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
    }``
  }

  const updateServerTime = () => {
    const melbourneTimezoneOffset = 10; // Melbourne is UTC+10 during standard time
    const now = new Date();
    
    const melbourneTime = new Date(now.getTime() + (melbourneTimezoneOffset * 60 * 60 * 1000));
    
    const month = (melbourneTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = melbourneTime.getUTCDate().toString().padStart(2, '0');
    const year = melbourneTime.getUTCFullYear().toString(); // Get last two digits of the year
    
    const hours = melbourneTime.getUTCHours().toString().padStart(2, '0');
    const minutes = melbourneTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = melbourneTime.getUTCSeconds().toString().padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
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
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <div className="text-end">
                <p className="text-white">SERVER TIME</p>
                <h4 className="text-white text-bold">{serverDateTime}</h4>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="row mt-3">
          <div className="col-md-3">
          {monitor ? (
          monitor.data.data.map((item, index) => (
            <div className="container" key={index}>
              <div className="row">
                <div className="col-md-6">
                  <h4>{item.attributes.pronounceable_name}</h4>
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
          </div>
          <div className="col-md-3">test</div>
          <div className="col-md-3">test</div>
          <div className="col-md-3">test</div>
        </div>
      </main>
    </>
  );
}

export default Monitors;
