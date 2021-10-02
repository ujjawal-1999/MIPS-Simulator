import React, {Component} from "react";
import {connect} from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class Registers extends Component {
    
    render() {
        const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      textAlign:'center'
    },
    body: {
      fontSize: 16,
      fontWeight:'bolder',
      textAlign:'center'
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(even)':{
        backgroundColor: 'lightgray'
      },
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
const reg = this.props.registers;
const rows = reg;
        return (
            <>
            <TableContainer component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Value</StyledTableCell>
            <StyledTableCell align="right">Hex Value</StyledTableCell>
            <StyledTableCell align="right">Binary Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row[0]}>
              <StyledTableCell component="th" scope="row">
                {row[0]}
              </StyledTableCell>
              <StyledTableCell align="right">{row[1]}</StyledTableCell>
              <StyledTableCell align="right">{Number(row[1]).toString(16).toUpperCase()}</StyledTableCell>
              <StyledTableCell align="right">{row[1].toString(2)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            </>
        );
    }

}

const mapStateToProps = (state) => {
    const registerKeys = Object.keys(state.registers);
    const stateRegister = state.registers;
    return {
        registers: registerKeys.map((key) => [key, stateRegister[key]])
    }
};


export default connect(mapStateToProps)(Registers);