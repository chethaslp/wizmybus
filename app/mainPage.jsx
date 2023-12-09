"use client";

// UI imports
import "leaflet/dist/leaflet.css";
import "./style.css";
import "react-leaflet-fullscreen/styles.css";
import "leaflet-loading/src/Control.Loading.css";
import "leaflet-geosearch/dist/geosearch.css";
import "@/components/ui/cmodal.css";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { FaBus } from "react-icons/fa6";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Skeleton,
} from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { Stack } from "react-bootstrap";


import { markerBlue, markerBus, markerSelf } from "@/components/map/icons";
import { MdMyLocation } from "react-icons/md";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { IoMdSearch } from "react-icons/io";
import { Card, Form, Button, Modal, FloatingLabel } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

// Leaflet Imports
import L from "leaflet";
import "leaflet-loading";
import { ImSpinner2 } from 'react-icons/im'
import { MapContainer, useMap, TileLayer, Marker, Popup } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { GeoSearchControl, LocationIQProvider } from "leaflet-geosearch";

// Component imports
import { Logo } from "@/components/ui/logo";
import app from "@/components/fb/config";
import { get } from "firebase/database";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { stops } from "@/components/map/stoplist";
import { RiLoader2Fill, RiLoader2Line } from "react-icons/ri";


const db = getFirestore(app);

function AddMapControls({ setCAddress, setPosition, handleShowModal }) {
  const map = useMap();

  // GEOSEARCH searchbar component
  const searchControl = new GeoSearchControl({
    provider: new LocationIQProvider({
      params: {
        key: "pk.acd8ae5a8715b1a28b22e1701806e88c",
      },
    }),
    style: "bar",
    showMarker: true,
    marker: {
      icon: markerBlue,
      draggable: true,
    },
    animateZoom: true,
    retainZoomLevel: true,
  });

  // SeflMarker
  // -> Finds your current location,
  // -> reverse geocode it to a readable address,
  // -> adds self marker to the map

  useEffect(() => {
    map.locate({ enableHighAccuracy: true });
    map.on("locationfound", function (e) {
      var marker = L.marker(e.latlng, {
        icon: markerSelf,
        draggable: false,
      }).bindTooltip("Your are here.");
      marker.addTo(map);

      map.flyTo(e.latlng, map.getZoom());
      console.log(e.latlng);

      fetch(
        `https://geocode.maps.co/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}`
      )
        .then((r) => r.json())
        .then((res) => {
          setCAddress(res.address.suburb);
        });
    });

    // LOCATION MARKERS
    // -> Loads marker data from firebase DB, and adds to UI.
    
    // GEOSEARCH
    // -> Allows users to search a location,
    // -> Gets readable address from the location

    map.on("geosearch/showlocation", (e) => {
      setPosition([e.location.y, e.location.x]);
      const a = e.location.label.split(", ");
      setCAddress(a[a.length - 5]);
    });

    map.on("geosearch/marker/dragend", (e) => {
      console.log(e);
      const m = e.marker;
      if (m != null) {
        setPosition(m.getLatLng());
        fetch(
          `https://geocode.maps.co/reverse?lat=${m.getLatLng()[0]}&lon=${
            m.getLatLng()[1]
          }`
        )
          .then((r) => r.json())
          .then((res) => {
            setCAddress(res.address.suburb);
          });
      }
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);


  return null;
}


export default function Home() {
  const searchParams = useSearchParams();
  const [cAddress, setCAddress] = useState();
  const [position, setPosition] = useState();
  const [initDone, setInitDone] = useState(false);

  const [frmlocation, setFrmlocation] = useState();
  const [tolocation, setTolocation] = useState();

  const [showModal, setShowModal] = useState(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [data, setdata] = useState([]);
  const [open, setopen] = useState(false)

  const [busPositon, setBuspostion] = useState();

  const skeletonStyle = {
    marginBottom: 10, // Adjust the margin-bottom value as needed
  };


  async function getBusdata(){
    await fetch(
      `/api/get_loc?to=${tolocation}&from=${frmlocation}`
    ).then((resp)=>{
      if (resp.ok){
        resp.json().then((data)=>{
          console.log(JSON.parse(data.data))
          setdata(JSON.parse(data.data));
        })
      }else{
        setdata(404)
      
    }})
  }

  

  const sbmit = (e) => {
    e.preventDefault();
    const d = {
      em: e.target[0].value,
      ty: e.target[1].value,
      lq: [position, e.target[2].value],
      dd: e.target[3].value,
      em: e.target[4].value,
      t: new Date().toISOString(),
    };
    submitData(d, () => {
      console.log("Done");
      location.reload();
    });
  };

  useEffect(()=>{
    const docRef = doc(db, "bus", "13645")
    const unsub = onSnapshot(docRef, (doc) => {
      console.log(doc.data())
            setBuspostion(doc.data())
        });
  },[]);

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      if (e.oldURL.length > e.newURL.length)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }, []);
  return (
    <div className="responsive  grid h-screen w-screen grid-flow-row grid-rows-[600px_auto] md:grid-rows-1 md:grid-cols-[minmax(20%,25%)_4fr] md:grid-flow-col">
      <Modal
        size="lg"
        scrollable
        backdropClassName="blur "
        className="!left-[10%] "
        show={showModal}
        onHide={handleCloseModal}
        variant="fullscreen"
      >
        <Modal.Header closeButton>
          <Modal.Title>Available Buses</Modal.Title>
        </Modal.Header>
        <Modal.Body >
        <div className="bus-detail">
      <div className="border-r-2 pr-5 h-full" style={{ width: "45%", cursor:"pointer"}}>
        {data.length!=0 ? ((data == 404)?<div>No Bus Route Found.</div>:
          <>
          {data.map((a)=>{
            return <div className="bus-card" onClick={()=> setopen(true)}>
            <div className="top">
              <h6>{a.bus_type}</h6>
              <p>10:00 - 12:00</p>
            </div>
            <div className="main">
              <h6>{a.route_name}</h6>
              <p>Via {a.via_route}</p>
            </div>
          </div>
          })}
          </>
        ) : (
          <>
            <Skeleton
              variant="rectangular"
              width={320}
              height={200}
              style={skeletonStyle}
            />
            <Skeleton
              variant="rectangular"
              width={320}
              height={200}
              style={skeletonStyle}
            />
            <Skeleton
              variant="rectangular"
              width={320}
              height={200}
              style={skeletonStyle}
            />
            <Skeleton
              variant="rectangular"
              width={320}
              height={200}
              style={skeletonStyle}
            />
          </>
        )}
      </div>
      <div style={{ width: "55%", display:"flex", justifyContent:"center", alignItem:"center" }}>
        {open ? (<Timeline position="left">
          <TimelineItem variant="right">
            <TimelineOppositeContent color="text.secondary">
              10:00am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Trivandrum</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              10:05am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <FaBus size={22} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Kollam</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              10:10am
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Allapuzha</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Thrissur</TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Kozhikode</TimelineContent>
          </TimelineItem>
        </Timeline>) : ( <h5>Select any bus</h5> )}
        
      </div>
    </div>

        </Modal.Body>
      </Modal>

      <div className="rounded-r-lg rounded-b-xl md:-mr-2 -mt-2 md:mt-0 z-[10000]">
        <Card className="text-black !h-full !w-full !bv">
          <Card.Header className="text-5xl flex flex-row">
            <Logo />
            {/* TODO: Check if location permission is OFF, if true, then change 'loading' icon to 'location disabled' icon. */}
            <div className="cursor-pointer text-xl font-semibold rounded p-2 flex flex-row gap-3 items-center">
              /{" "}
              {cAddress ? (
                cAddress
              ) : (
                <div className="flex justify-center items-center">
                  <ImSpinner2 className="animate-spin" />
                </div>
              )}
            </div>
          </Card.Header>
          <Card.Body className="overflow-auto">
            <Form
              className="border border-gray-500 rounded p-3 gap-2"
              onSubmit={sbmit}
            >
              <Card.Title className="!flex flex-row gap-2 items-center">
                <IoMdSearch size={30} /> Search Bus
              </Card.Title>
              <hr />
              <Form.Group controlId="fr-frm" className="mb-3">
                <Form.Label>From: </Form.Label>
                <Typeahead
                  placeholder="Enter a location"
                  selected={frmlocation}
                  onChange={(selected) => {
                    console.log(selected);
                    setFrmlocation(selected);
                  }}
                  options={stops}
                />
              </Form.Group>

              <div className="flex items-center justify-center">
                <CgArrowsExchangeAltV
                  size={30}
                  className="shadow-sm cursor-pointer border rounded  m-2 scale-100 hover:scale-110 hover:shadow-lg"
                  onClick={() => {
                    setFrmlocation(tolocation);
                    setTolocation(frmlocation);
                  }}
                />
              </div>

              <Form.Group controlId="fr-to">
                <Form.Label>To: </Form.Label>
                <Typeahead
                  placeholder="Enter a location"
                  selected={tolocation}
                  onChange={(selected) => {
                    setTolocation(selected);
                  }}
                  options={stops.filter((item) => item != frmlocation)}
                />
              </Form.Group>
              <div className="mt-3 flex justify-center ">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={()=>{
                  handleShowModal()
                  getBusdata()}}
                >
                  Search
                </Button>
              </div>
            </Form>
          </Card.Body>
          {/* <Card.Footer className='text-muted text-center'>
          Made with 💖 by <a href='https://github.com/chethaslp' target='_blank' className='no-underline'>@clp</a>
        </Card.Footer> */}
        </Card>
      </div>
      <div className="order-1 md:!order-2 h-[inherit]">
        <MapContainer
          center={[8.432719, 77.07605]}
          zoom={13}
          scrollWheelZoom={true}
          loadingControl={true}
        >
          {searchParams.has("st") ? (
            <>
              <ReactLeafletGoogleLayer type={"satellite"} />
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" />
            </>
          ) : (
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          )}
          {!initDone ? (
            <>
              <FullscreenControl forceSeparateButton={true} />
              <AddMapControls
                setCAddress={setCAddress}
                setPosition={setPosition}
                handleShowModal={handleShowModal}
              />
              {(busPositon)?
              <Marker position={{lat: busPositon.l[0], lng: busPositon.l[1]}}>
                <Popup>
                {busPositon[1]}
                </Popup>
            </Marker>:null}
            </>
          ) : null}
        </MapContainer>
      </div>
      {/* <div className='z-[1000000] md:d-none' onClick={()=>{
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }}>
    </div> */}
    </div>
  );
}
