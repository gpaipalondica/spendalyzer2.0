import React, { useEffect, useState } from 'react';
import '../Styles/Expense.css';
import Chart from './Chart';

function Expense({ authToken }) {


    const [uname, setUname] = useState('My')
    const [chart, setChart] = useState(false)


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

  useEffect(() => {

    const getThisUser = localStorage.getItem('user')
    let thisUsername = JSON.parse(getThisUser).username

    setUname(thisUsername)

    const getData = localStorage.getItem('data');

    if (getData) {
      const parsedData = JSON.parse(getData);
      // Instead of calling the printData2 function, update state to trigger a render.
      setExpenseData(parsedData);
    }
  }, []);

  // Define your expense data as a state variable
  const [expenseData, setExpenseData] = useState([]);


  async function getDataByUser(){
    const user=localStorage.getItem("user");
    let username = JSON.parse(user).username

    // console.log(username);

    let fetchedData = await getExpByUser(username)

    // console.log(fetchedData);
    setExpenseData(fetchedData)
  }

  async function getExpByUser(name) {
    return fetch('http://localhost:3000/list/'+name, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('data', JSON.stringify(data))
        return data; // Return the data inside the Promise chain
      })
      .catch(error => {
        console.log('Error in GET function', error);
        throw error; // Rethrow the error to propagate it
      });
  }


  function openForm(){
    document.querySelector('.formArea').style.display = 'flex'
}
function closeForm(){
    document.querySelector('.formArea').style.display = 'none'
}
function closeForm2(){
    document.querySelector('.formArea2').style.display = 'none'
}

  function addExp(e){
    e.preventDefault()
    const user=localStorage.getItem("user");
    let username = JSON.parse(user).username

    let newExp = document.getElementById('myForm') 

    let val={}
     let formData = new FormData(newExp)
     formData.forEach((value, key) => {
        val[key] = value
    });
    
    let data = {
        "title": val.title,
        "amount": val.amount,
        "date" : val.date,
        "username": username
    }
    // console.log(data);

    fetch('http://localhost:3000/expense',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data =>{
        // console.log(data);
        document.querySelector('.formArea').style.display = 'none'
        newExp.reset()
        getDataByUser()
    })
    .catch(error => {
        console.error("POST Error", error)
    });
}



  function keyhandle(event){
    if (event.keyCode === 13) {
        event.preventDefault();
      }
  }

  let t
  function editMonthDiv(event){
    t = event.currentTarget

    let rows = t.parentNode.querySelectorAll('.inData .twoBtns'),i;

    if(t.innerHTML == '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'){
        t.innerHTML = '<svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 16 16" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"></path><path d="M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z"></path></svg>'
        for(i=0; i<rows.length; i++){
            rows[i].style.display = 'flex'
        }
    }
    else if(t.innerHTML == '<svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 16 16" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"></path><path d="M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z"></path></svg>'){
        t.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'
        for(i=0; i<rows.length; i++){
            rows[i].style.display = 'none'
        }
        
    }
  }

  function editThis(s){
    let selNode = s.currentTarget.parentNode.parentNode;

    // console.log(selNode);
    let id = parseInt(selNode.id)
    // console.log(id);

    let selTitle = selNode.children[0].innerHTML
    let selAmount= parseFloat((selNode.children[1].innerHTML).substring(1))

    document.getElementById('f2-id').value = id
    document.getElementById('f2-title').value = selTitle
    document.getElementById('f2-amt').value = selAmount

    document.querySelector('.formArea2').style.display='flex'

}

function editSubmit(e) {
    e.preventDefault()
    let newExp = document.getElementById('myForm2') 

    let val={}
     let formData = new FormData(newExp)
     formData.forEach((value, key) => {
        val[key] = value
    });

    // console.log(val);

    let id = parseInt(val.id)
    
    let data = {
        "title": val.title,
        "amount": parseFloat(val.amount)
    }
    // console.log(data);

    fetch('http://localhost:3000/expense/'+id,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data =>{
        // console.log("UPDATED", data);
        closeForm2()
        newExp.reset()
        getDataByUser()
    })
    .catch(error => {
        console.log("UPDATE ERROR", error);
    })
}

function deleteThis(d){
    let tar = d.currentTarget.parentNode.parentNode
    // console.log("tar",tar);

    let tarTitle = tar.children[0].innerHTML

    let tarId = parseInt(tar.id)
    // console.log(tarId);

    let thatMonth = tar.parentNode.parentNode.parentNode.querySelector('.editBtnPerMonth')
    // console.log(thatMonth);

    
    let conf = window.confirm(`Are you sure to delete "${tarTitle}"?`)

    // console.log(conf);

    if(conf){
        fetch('http://localhost:3000/expense/'+tarId,{
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data =>{
            // console.log('DELETED',data);
            let allbtns = document.querySelectorAll('.twoBtns'),j
            
            for(j=0; j<allbtns.length; j++){
                allbtns[j].style.display = 'none'
            }

            // for(k=0;k<thatMonth.length; k++){
            //    let test = thatMonth[k].querySelectorAll('.twoBtns'),l
            //    for (l=0 ; l <test.length; l++) {
            //     test[l].style.display = 'flex'
            //    }
            // }

           thatMonth.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'
            getDataByUser()

        })
        .catch(error => {
            console.error("DELETE Error", error)
        });
    }else{
        // console.log('not deleted');
    }

}


function changeView(e){
  //change from list to graph and viceversa
  let id = e.currentTarget.id
  // console.log(id);


  let both = document.querySelectorAll('.btnViews'),i;
  for(i=0;i<both.length;i++){
      both[i].classList.remove('active')
  }

  document.getElementById(id).classList.add('active')

  if(id == 'graphView'){
      document.querySelector('.listings').style.display = 'none'
      setChart(true)
    }
    else if(id == 'listView'){
      document.querySelector('.listings').style.display = 'flex'
      setChart(false)
  }
}

  
  return (
    <div className="myExpenses">

    <div className="formArea">
        <form id="myForm" onSubmit={addExp} method="POST">
            <button type="button" onClick={closeForm}>X</button>
            <div className="form-item">
                <label htmlFor="title">Title</label>
                <input id="hello" type="text" name="title"  onKeyDown={keyhandle}/>
            </div>
            <div className="form-item">
                <label htmlFor="amount">Amount</label>
                <input type="text" name="amount"  onKeyDown={keyhandle}/>
            </div>
            <div className="form-item">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" placeholder="MM/DD/YYYY"  onKeyDown={keyhandle}/>
            </div>
            <input type="submit" value="Add Expense" />
        </form>
    </div>

    <div className="formArea2">
            <form id="myForm2" onSubmit={editSubmit}>
                <button type="button" onClick={closeForm2}>X</button>
                <div className="form-item"  style={{display: 'none'}}>
                    <label htmlFor="id">id</label>
                    <input id="f2-id" readOnly type="text" name="id" onKeyDown={keyhandle} />
                </div>
                <div className="form-item">
                    <label htmlFor="title">Title</label>
                    <input id="f2-title"type="text" required name="title" onKeyDown={keyhandle} />
                </div>
                <div className="form-item">
                    <label htmlFor="amount">Amount</label>
                    <input id="f2-amt" type="text" required name="amount" onKeyDown={keyhandle} />
                </div>
                <input type="submit" value="Modify" />
            </form>
        </div>
        

      {authToken ? (
        <div>
          <h1 style={{ textAlign: 'center', marginTop: '30px' }}>{uname}'s Expenses</h1>

          <button className="refreshBtn" onClick={getDataByUser} ><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 11H7.101c0-.003 0-.006.001-.009.065-.319.163-.634.291-.937.126-.297.281-.583.461-.85.178-.264.384-.513.61-.74C8.691 8.238 8.94 8.032 9.206 7.853c.266-.18.551-.334.848-.46.302-.128.617-.226.938-.291.658-.135 1.357-.135 2.018 0 .318.065.634.163.937.291.296.125.581.281.85.461.266.179.514.384.738.609l1.416-1.412c-.314-.316-.664-.604-1.036-.855-.373-.252-.773-.47-1.188-.646-.425-.18-.868-.317-1.315-.408-.923-.189-1.899-.189-2.819 0-.449.092-.892.229-1.316.409C8.858 5.727 8.458 5.944 8.086 6.196 7.716 6.445 7.368 6.733 7.05 7.05S6.445 7.716 6.197 8.085c-.252.373-.47.773-.646 1.19-.18.424-.317.867-.408 1.315C5.115 10.725 5.1 10.863 5.08 11H2l4 4L10 11zM14 13h2.899c-.001.003 0 .006-.001.008-.066.324-.164.639-.292.938-.123.293-.278.579-.459.848-.179.264-.385.514-.613.742-.225.225-.473.43-.739.61-.268.18-.553.335-.849.461-.303.128-.618.226-.938.291-.657.135-1.357.135-2.017 0-.319-.065-.634-.163-.937-.291-.297-.126-.583-.281-.85-.461-.264-.178-.513-.384-.74-.61L7.05 16.95c.317.317.666.605 1.035.854.373.252.773.47 1.19.646.424.18.867.317 1.315.408C11.051 18.952 11.525 19 12 19s.949-.048 1.408-.142c.449-.091.893-.229 1.317-.409.415-.176.815-.393 1.188-.645.372-.251.722-.54 1.035-.854.317-.317.605-.666.855-1.037.254-.377.472-.777.645-1.187.178-.42.315-.863.408-1.316.027-.135.043-.273.063-.41H22l-4-4L14 13z"></path></svg></button>
          <button className="addForm" onClick={openForm}>+</button>

          <div className="viewModes">
            <button id="listView" className="btnViews active" onClick={changeView}>
              List
            </button>
            <button id="graphView" className="btnViews" onClick={changeView}>
              Graph
            </button>
          </div>

          <div className="listings">
            {expenseData.length> 0 ? 
            <div id="printDataNow">
            <div>
              {expenseData.map((dataItem, index) => (
              <div key={index} className="expMonth">
                <h2 className="month-disp">
                  {allMonths2[dataItem.Month - 1]} {dataItem.Year}: &nbsp;&nbsp;&nbsp;${dataItem.MonthlyAmount.toFixed(2)}
                </h2>
                <button className="editBtnPerMonth" onClick={editMonthDiv}> 
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
                {/* Render inData here */}
                {dataItem.MonthData.map((monthDataItem, monthDataIndex) => (
                  <div key={monthDataIndex} className="expense-row">
                    <div className="headerRow">
                      <h3>{allMonths2[monthDataItem.Date.split('-')[1] - 1]} {monthDataItem.Date.split('-')[2]}</h3>
                      <h3>${monthDataItem.DailyAmount.toFixed(2)}</h3>
                    </div>
                    <div className="outData">
                      {monthDataItem.Data.map((inDataItem, inDataIndex) => (
                        <div key={inDataIndex} className="inData" id={inDataItem.id}>
                          <p>{inDataItem.Title}</p>
                          <p>${inDataItem.Amount.toFixed(2)}</p>
                          <div className="twoBtns">
                            <button className="btnEdit" onClick={editThis}>E</button>
                            <button className="btnDel" onClick={deleteThis}>D</button>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div> 
          </div>
            :
            <div>
              <p style={{textAlign:'center', marginTop:'30px'}}>** Create your first expense **</p>  
            </div>}
            
          </div>

        
            {chart==true && 
            <Chart /> 
            }
              
           

        </div>
      ) : (
        <div>

        </div>
      )}

    </div>
  );
}

export default Expense;
