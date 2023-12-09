import React, { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
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

function BusDetails({setopen,setdata, data, open}) {
    const skeletonStyle = {
      marginBottom: 10, // Adjust the margin-bottom value as needed
    };
 
  
  return (
    
    <div className="bus-detail">
      <div className="border-r-2 pr-5 h-full" style={{ width: "45%", cursor:"pointer"}}>
        {data ? ((data == 404)?<div></div>:
          <>
            <div className="bus-card" onClick={()=> setopen(true)}>
              <div className="top">
                <h6>Super Fast</h6>
                <p>10:00 - 12:00</p>
              </div>
              <div className="main">
                <h6>Thrivandrum - Thrissur</h6>
                <p>Arrival : 10:05</p>
              </div>
            </div>
            <div className="bus-card"></div>
            <div className="bus-card"></div>
            <div className="bus-card"></div>
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
  );
}

export default BusDetails;
