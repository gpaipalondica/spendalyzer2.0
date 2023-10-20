import React, { useEffect, useRef, useState } from 'react';

function Chart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      createChart();
    }
  }, []);

  const [sendGraph, setSendGraph] = useState(true)

  const allMonths2 = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const createChart = () => {
    
    let defMon = JSON.parse(localStorage.getItem('data'))
    // console.log("Graph",defMon.length);

    if(defMon.length>0){

      setSendGraph(true)

      document.getElementById('selMonth').innerHTML=''
    for(let j=0; j<defMon.length; j++){
      let op = document.createElement('option')
      let month = (defMon[j].Month).toString().padStart(2,'0')
      op.setAttribute('value',defMon[j].Year+'-'+month    )
      op.innerHTML = allMonths2[month-1]+' '+defMon[j].Year
      
      document.getElementById('selMonth').appendChild(op)
  }

    let d = defMon[0].MonthData
    // console.log("Graph", d);

    let xy = {}

    d.forEach(item => {
          xy[item.Date] = parseFloat(item.DailyAmount.toFixed(2))
      });

  // console.log("xy", xy);

  let xyVal = {}

  const keys = Object.keys(xy).reverse();
  keys.forEach(key => {
      xyVal[key] = xy[key];
    });
  
    // console.log("xyVal", xyVal);

    drawChart(xyVal)
    
    } 
    else{
      // console.log("Nothing to display for chart");
      setSendGraph(false)
    }
  }


function drawChart(val){

  let xy = val
  const ctx = chartRef.current.getContext('2d');

  const myChart = new window.Chart(ctx, {
    type: "line",
            data: {
              labels: Object.keys(xy),
              datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: Object.values(xy)
              }]
            },
            options: {
              legend: {display: false},
              scales: {
                   
                }
            }
  });
}


async function changeMonth(){

  let user = JSON.parse(localStorage.getItem('user'))
  let username = user.username

  // console.log(username);


    // console.log(document.getElementById('selMonth').value);
    let k = document.getElementById('selMonth').value
  
    await fetch('http://localhost:3000/graph/'+k,{
        method: "GET" 
        })
        .then(response => response.json())
        .then(data2 => {
           
            let data = data2.filter(d => d.username == username)

            let xy={}
            data.forEach(item => {
                xy[item.Date] = item.DailySum.toFixed(2)
            });
      
          // console.log("xyNow", xy);
      
            drawChart(xy)
            
        })
        .catch(error => {
            console.log("Error in GET function", error);
        })
  }

  return (
    <div id="graph-container">
      {sendGraph? <>
        <div style={{display: 'flex', gap:"30px"}}>
          <select name="month" id="selMonth" onChange={changeMonth}></select>
        </div>
        <canvas id="myChart" ref={chartRef} style={{width:'90%',maxWidth:'800px',height:'500px'}}></canvas>
      </>
        :
      <>
        <p style={{marginTop:'30px', textAlign:'center'}}>** No data to show on graph **</p>
      </>}
    </div>
  );
}

export default Chart;
