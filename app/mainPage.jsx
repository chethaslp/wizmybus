"use client"

// UI imports
import 'leaflet/dist/leaflet.css'
import "react-leaflet-fullscreen/styles.css";
import "leaflet-loading/src/Control.Loading.css";
import 'leaflet-geosearch/dist/geosearch.css';
import { markerBlue, markerRed, markerSelf } from '@/components/map/icons';
import { Card, Form, Button, Modal} from 'react-bootstrap';

// Leaflet Imports
import L from "leaflet";
import "leaflet-loading";
import { MapContainer, useMap, TileLayer} from 'react-leaflet'
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { FullscreenControl } from 'react-leaflet-fullscreen';
import { GeoSearchControl, LocationIQProvider } from 'leaflet-geosearch'

// Component imports
import { db, submitData } from '@/components/fb/db';
import { Logo } from '@/components/ui/logo';
import { get } from 'firebase/database';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';


const getIssueString = (i) =>  ["Water Unavailibilty", "Sewer Overflow", "Water Pipeline Disrupt", "Water rise in sea/rivers", "Flood warning!"][parseInt(i)-1]

function AddMapControls({setCAddress, setPosition, handleShowModal}) {
  const map = useMap()

  // GEOSEARCH searchbar component
  const searchControl = new GeoSearchControl({
    provider: new LocationIQProvider({
      params:{
        key : 'pk.acd8ae5a8715b1a28b22e1701806e88c'
      }
    }),
    style:'bar',
    showMarker: true,
    marker: {
      icon: markerBlue,
      draggable: true
    },
    animateZoom:true,
    retainZoomLevel: true
  })

  // SeflMarker
  // -> Finds your current location,
  // -> reverse geocode it to a readable address,
  // -> adds self marker to the map
  useEffect(()=>{
     map.locate({enableHighAccuracy:true}).on("locationfound", function (e) {
      var marker = L.marker(e.latlng,{icon:markerSelf,draggable:true}).bindTooltip('Your are here.');
      marker.addTo(map);

      map.flyTo(e.latlng, map.getZoom());
      console.log(e.latlng)
      fetch(`https://geocode.maps.co/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(r=> r.json())
          .then(res => {
            setCAddress(res.display_name)
          })
    })

  // LOCATION MARKERS
  // -> Loads marker data from firebase DB, and adds to UI.
      get(db).then((ss) => {
        if (ss.exists()) {
            ss.forEach((de) => {
              const d=de.val()
              /*

              d:list [Data Object]
                dd:str -> Data description
                em:str -> Email
                t:str -> Datetime
                lq:list -> [latlng:list, address:str]
                ty:str -> Issue type

                For `ty`:
                  1 -> Water Unavailibilty
                  2 -> Sewer Overflow
                  3 -> Water Pipe Disrupt
                  4 -> Water rise in sea/rivers
                  5 -> Flood warning

              */
             let marker
              if(d.ty == "5"){
                marker = markerRed  // Marker for Flood warning
                L.circle(d.lq[0], 1000, {color: "red", stroke:false, fillOpacity:0.5}).addTo(map);  // Adds a red circle of 1000m radius around the marker
              }else if(d.ty == "4"){ 
                marker = markerBlue// Marker for Water Level Rise
                L.circle(d.lq[0], 1000, {color: "yellow", stroke:false, fillOpacity:0.5}).addTo(map);
              } else marker = markerBlue
              L.marker(d.lq[0],{icon:marker}).bindTooltip(`<b>${getIssueString(d.ty)}</b><br/><small class='text-muted'>Click to view.</small>`)
              .on("click",(e)=>{
                console.log(de.key)
                handleShowModal()

              }).addTo(map);
            })
        }
      }).catch((error) => {
        console.error(error);
      });

  // GEOSEARCH
  // -> Allows users to search a location,
  // -> Gets readable address from the location

    map.on('geosearch/showlocation', (e)=>{
      console.log(e)
      setPosition([e.location.y, e.location.x])
      setCAddress(e.location.label)
    });

    map.on('geosearch/marker/dragend', (e)=>{
      console.log(e)
        const m = e.marker
        if (m != null) {
          setPosition(m.getLatLng())
          fetch(`https://geocode.maps.co/reverse?lat=${m.getLatLng()[0]}&lon=${m.getLatLng()[1]}`)
          .then(r=> r.json())
          .then(res => {
            setCAddress(res.display_name)
          })
        }
    });

      map.addControl(searchControl)
      return () => map.removeControl(searchControl)
  }, [])


  return null;
}


export default function Home() {
  const searchParams = useSearchParams();
  const [cAddress, setCAddress] = useState()
  const [position, setPosition] = useState()
  const [initDone, setInitDone] = useState(false)

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const sbmit = (e)=>{
    e.preventDefault()
    const d = {
      em: e.target[0].value,
      ty: e.target[1].value,
      lq: [position,e.target[2].value],
      dd: e.target[3].value,
      em: e.target[4].value,
      t: new Date().toISOString()
    }
    submitData(d,()=>{
      console.log("Done")
      location.reload()
    })
  }

  useEffect(()=>{
    window.addEventListener("hashchange", function(e) {
      if(e.oldURL.length > e.newURL.length)
        document.body.scrollTop = document.documentElement.scrollTop = 0;
   });
  },[])
  return <div className='grid md:flex h-screen w-screen'>
    <Modal centered show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Modal body text</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    <div className='w-full md:w-1/4 rounded-r-lg rounded-b-xl -mr-2 z-[10000]'>
      <Card className='text-black !h-full !w-full !bv'>
        <Card.Header className='text-5xl'><Logo/></Card.Header>
        <Card.Body className=''>
          
          <Form className='border border-gray-500 rounded p-3 gap-2' onSubmit={sbmit}>
            <Card.Title>Search bus</Card.Title>
            <hr/>
            <Form.Group controlId="fm_eml" className="mt-2" >
              <Form.Label>Email address <small className='text-muted'>(required)</small></Form.Label>
              <Form.Control type="email" required={true} placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mt-2 mb-3" controlId="fm_ist">
              <Form.Label>Issue Type <small className='text-muted'>(required)</small></Form.Label>
              <Form.Control as="select" required={true}>
                <option disabled selected>Select</option>
                <option className='bg-blue-500 text-white' value="1">Water unavailibilty</option>
                <option className='bg-blue-500 text-white' value="2">Sewer Overflow</option>
                <option className='bg-blue-500 text-white' value="3">Water Pipe disrupt</option>
                <option className='bg-yellow-600 text-white' value="4">Water level rise in Sea/River</option>
                <option className='bg-red-600 text-white' value="5">Flood warning</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-2" controlId="fm_add">
              <Form.Label>Current Address</Form.Label>
              <Form.Control  required={true} as="textarea" rows={3} value={cAddress}/>
            </Form.Group>
            <Form.Group className="mb-2" controlId="fm_des">
              <Form.Label>Detailed Description</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className='mt-2 mb-2'>
              <Form.Label>Image for reference</Form.Label>
              <Form.Control type="file" onChange={(e)=>
                  {
                    var files = e.target.files
                    if (files[0] && files[0].size < 5000000 && files[0].type.startsWith("image")) ;
                    else console.log("INVALID FILE");
                  }}
                  />
            </Form.Group>
           
           <small className='text-muted mt-2 mb-1'>Submission time will be recorded.</small><br/>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          
        </Card.Body>
        {/* <Card.Footer className='text-muted text-center'>
          Made with 💖 by <a href='https://github.com/chethaslp' target='_blank' className='no-underline'>@clp</a>
        </Card.Footer> */}
      </Card>
    </div>
    <div className='w-full md:w-3/4 h-screen'>
        <MapContainer center= {[8.432719,77.076050]}  zoom={13} scrollWheelZoom={true} loadingControl={true} >
          {searchParams.has("st")? <>
            <ReactLeafletGoogleLayer type={'satellite'} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            />
          </>:
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>}
          {(!initDone)? <>
            <FullscreenControl forceSeparateButton={true}/>
            <AddMapControls setCAddress={setCAddress} setPosition={setPosition} handleShowModal={handleShowModal}/>
          </>:null}
        </MapContainer>
        
    </div>
    <div className='z-[1000000] md:d-none' onClick={()=>{
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }}>
      Hi
    </div>
</div>
}