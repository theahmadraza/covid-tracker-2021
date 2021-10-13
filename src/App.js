import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

import "./App.css";
import logo from './assets/images/covid-19.png'
import InfoBox from "./components/InfoBox";
import Maps from "./components/Maps";
import Table from "./components/Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [casesType, setCasesType] = useState("cases")
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.8074, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  

  useEffect(() => {
    const getCountryData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
          
        });
    };
    getCountryData();
  }, []);



  const countryChangeHandler = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="App">
      <div className="app-left">
        <div className="app-header">
          <div className="app-headerLeft">
          <img src={logo} alt="covid-19 Icon" />
          <h1>Covid-19 Tracker</h1>
          </div>
          <FormControl className="app-dropdown">
            <Select
              variant="outlined"
              onChange={countryChangeHandler}
              value={country}
            >
              <MenuItem value={country}> Worldwide </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app-stat">
          <InfoBox
          onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            active={casesType === "cases"}
            isRed
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            active={casesType === "recovered"}
          />
          <InfoBox
          onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            active={casesType === "deaths"}
            isRed
          />
        </div>
        <Maps casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries} />
      </div>
      <Card>
        <CardContent>
          <h2 className="table-title">Live Cases by Country</h2>
          <Table countries={tableData} />
          <h2 className="table-title">Worldwide New {casesType}</h2>
          <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
