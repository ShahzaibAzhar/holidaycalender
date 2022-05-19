import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

function App() {
  const [holidays, setHolidays] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState([]);

  useEffect(() => {
    fetch(
      `https://calendarific.com/api/v2/countries?api_key=5a711ddf03c11e27ae4735781499c4af131711f0`
    )
      .then((resp) => resp.json())
      .then((result) => {
        const countryData = result.response.countries;
        const countryList = [];
        for (let index = 0; index < countryData.length; index++) {
          let obj = {
            name: countryData[index].country_name,
            code: countryData[index]["iso-3166"],
          };
          countryList.push(obj);
        }
        setCountry(countryList);
      });
  }, []);
  useEffect(() => {
    fetch(
      `https://calendarific.com/api/v2/holidays?api_key=5a711ddf03c11e27ae4735781499c4af131711f0&country=
        ${countryCode} 
        &year=2022`
    )
      .then((resp) => resp.json())
      .then((result) => {
        const holidayData = result.response.holidays;
        const holidayList = [];
        for (let index = 0; index < holidayData.length; index++) {
          let events = {
            title: holidayData[index].name,
            start: holidayData[index].date.iso,
            end: holidayData[index].date.iso,
          };
          holidayList.push(events);
        }
        setHolidays(holidayList);
      });
  }, [countryCode]);

  const localizer = momentLocalizer(moment);

  return (
    <div className="App">
      <h1>Holidays Calendar</h1>
      <div className="style">
        <p>Select Country</p>
        <select
          value={countryCode}
          onChange={(e) => {
            setCountryCode(e.target.value);
          }}
        >
          <option value="">select country</option>
          {country.map((option) => (
            <option value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>
      <div className="style">Holidays for Country Code: {countryCode}</div>
      <Calendar
        localizer={localizer}
        events={holidays}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default App;
