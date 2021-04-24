
import { Container } from "@material-ui/core";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";

export default function GlobalLineChart({
  data,
  xAxis,
  yAxis,
  dataValue,
  color,
  tooltip,
  legend,
  graphFit,
  graphHIGH,
  graphLOW
}) {
  return (

    <Container>

    
      <LineChart
        width={1400} 
        height={700}
        responsive={true}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xAxis}  />
        <YAxis domain={graphFit} />
        {tooltip ? <Tooltip /> : null}
        {legend ? <Legend /> : null}
        <Line
          dataKey={dataValue}
          stroke={color}
          activeDot={{ r: 8 }}
          strokeWidth={2.5}
          animationDuration={50}
          animationEasing="linear"
          
        />
        <ReferenceLine y={graphHIGH} label="Your HIGH" stroke="green" />
        <ReferenceLine y={graphLOW} label="Your LOW" stroke="red" />
      </LineChart>
      

    </Container>
  );
}
