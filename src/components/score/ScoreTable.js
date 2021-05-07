import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import firebase from "firebase";
import { useState, useRef, useEffect } from 'react';
import { ListItemAvatar } from "@material-ui/core";
 





const columns = [
  {
    id: "rank",
    label: "Rank",
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString("en-US")
  },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "accuracy", label: "Accuracy", minWidth: 100 },
  {
    id: "score",
    label: "Score",
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString("nob")
  }
];

export function createData(rank, name, accuracy, score) {
  return { rank, name, accuracy, score };
}




const db = firebase.firestore();





const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});




export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [scores,setScores] = useState([])

  const fetchScores=async()=>{
  const response=db.collection('score');
  const data=await response.get();

  data.docs.forEach(item=>{
    if (item.exists){
      setScores([...scores,item.data()])
    }
    else{
      console.log("item already added ");
    }
   
  })
} 


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function iterateData(){
    
   
  }


  

   var rows = [
     createData(1, "Benjamin", "99%", 2000),
     createData(2, "Sigurd", "95%", 1800),
     createData(3, "Magomed", "93%", 1500),
     createData(4, "Felix", "90%", 1400)

   ];

  
       /* for (var i = 0; i < scores.length; i++) {
            rows.push(createData(scores && scores.map(scores=>{return(scores.rank)}), scores && scores.map(scores=>{return(scores.name)}),scores && scores.map(scores=>{return(scores.accuracy)}), scores && scores.map(scores=>{return(scores.score)})));
        } */

  

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
