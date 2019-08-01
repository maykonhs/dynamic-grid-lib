import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TablePagination, TableRow, Paper, Checkbox,
    Button, Grid, IconButton, Tooltip
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DeleteIcon from '@material-ui/icons/Delete';
import DynamicCell from './DynamicCell';
import DynamicHead from './DynamicHead';
import DynamicSum from './DynamicSum';
import './index.css';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    },
    table: {
        minWidth: 385
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    addButton: {
        background: '#FF8C00',
        fontSize: 10,
    }
});

const StyledTableRow = withStyles(theme => ({
    root: {
        height: '30px',
    }
}))(TableRow);

const CustomCell = withStyles({
    root: {
        fontSize: 12,
        padding: 2,
    },
})(TableCell);

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function setOrderInitial(itens) {

    var order = '';
    if (itens !== undefined) {
        itens.map(item => {
            if (item.order === true) {
                order = item.nat_autonumber;
            }
        });
    }
    return order;
}

function hasCount(columns) {
    var countView = false;

    for (var i = 0; i < columns.length; i++) {
        if (columns[i].nat_total === true) {
            countView = true;
            break;
        }
    }

    return countView;
}

class DynamicGrid extends React.Component {

    constructor(props) {
        super(props);
        let orderBy = setOrderInitial(props.grid.gridColumn);

        this.state = {
            order: 'asc',
            orderBy: orderBy,
            selected: [],
            itensDuplicate: [],
            page: 0,
            rowsPerPage: 5,
            funcDuplicate: this.props.funcDuplicate,
            funcDeleted: this.props.funcDeleted,
            deleted: this.props.deleted
        };
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: this.props.grid.Grid.Rows.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        const response = this.props.func.checkboxFunction(id, selected);
        if (response) {
            let newSelected = [];
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
            this.setState({ selected: newSelected });
        }
    };

    removeItem = (event, id) => {
        var itemRemove = this.props.grid.Grid.Rows.filter(item => item.id === id);
        var itens = this.props.grid.Grid.Rows.filter(item => item.id !== id);
        this.props.grid.Grid.Rows = itens;
        this.setState(this.props.grid.Grid.Rows);

        if (this.state.funcDeleted) {
            this.state.funcDeleted(itemRemove[0]);
        }
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getItensSelect = itemSelect => {

        itemSelect.map(item => {
            var itemAdd = this.props.grid.Grid.Rows.filter(function (i) { return i.id === item; })[0];

            if (!this.state.itensDuplicate.indexOf(itemAdd) >= 0) {
                this.state.itensDuplicate.push(itemAdd);
            }
        });

        this.setState(this.state.itensDuplicate);
        this.setState({ selected: [] });
        this.setState({ itensDuplicate: [] });
    }

    itensSelected = event => {
        this.getItensSelect(this.state.selected);

        this.state.funcDuplicate(this.state.itensDuplicate);
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        var shownEmpty = { display: this.props.grid.Grid.Rows.length <= 0 ? "" : "none" };
        var showAdd = { display: this.state.funcDuplicate ? "" : "none" };
        var columns = this.props.grid.Grid.GridColumn.sort((a, b) => a.nat_position > b.nat_position ? 1 : -1);
        var countView = hasCount(columns);

        return (
            <div>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle" size="small">
                            <DynamicHead
                                numSelected={selected.length}
                                disabledCheckbox={this.props.disabledCheckbox}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={this.props.grid.Grid.Rows.length}
                                data={columns}
                                deleted={this.state.funcDeleted}
                                selected={this.props.selected}
                                count={countView}
                            />
                            <TableBody>

                                {this.props.grid.Grid.Rows.map((item, index) => { if (item !== undefined) { item.id = index; } })}

                                {stableSort(this.props.grid.Grid.Rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item) => {
                                        const isSelected = this.isSelected(item.id);
                                        return (
                                            <StyledTableRow hover role="checkbox" aria-checked={isSelected}
                                                tabIndex={-1} key={item.id} selected={isSelected}
                                            >
                                                <CustomCell padding="checkbox" className="readonly" style={{ display: this.props.selected === false && !countView ? "none" : "" }}>
                                                    <Checkbox
                                                        onClick={event => this.handleClick(event, item.id)}
                                                        checked={isSelected}
                                                        style={{ width: 'auto', height: 'auto', padding: 0, display: this.props.selected === false ? "none" : "" }}
                                                        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                                                        checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                                                    />
                                                </CustomCell>
                                                {
                                                    this.state.funcDeleted ?
                                                        <CustomCell onClick={event => this.removeItem(event, item.id)} className="readonly">
                                                            <Tooltip title="Delete">
                                                                <IconButton aria-label="Delete" style={{ width: 20, height: 20, padding: 0 }}>
                                                                    <DeleteIcon style={{ fontSize: 20 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CustomCell>
                                                        : null
                                                }
                                                <DynamicCell item={item} columns={columns} func={this.props.func} />
                                            </StyledTableRow>
                                        );
                                    })}
                                <StyledTableRow style={shownEmpty}>
                                    <CustomCell className="readonly" align="center" style={{ padding: 10 }} colSpan={this.props.grid.Grid.GridColumn.length + 1 + (this.state.deleted ? 1 : 0)}>
                                        Nenhum dado encontrado
                                    </CustomCell>
                                </StyledTableRow>
                                {countView ? <DynamicSum data={this.props.grid.Grid.Rows} columns={columns} />
                                    : null}

                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.grid.Grid.Rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page'
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page'
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        style={{
                            overflowX: 'auto'
                        }}
                        labelRowsPerPage={'Mostrar:'}
                        labelDisplayedRows={({ from, to, count }) => `De ${from} a ${to} | Total: ${count}`}
                    />
                </Paper>
                <Grid container style={showAdd}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.addButton}
                            disabled={this.props.disableAddButton}
                            onClick={event => this.itensSelected(this.props.func)}>
                            Adicionar
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(DynamicGrid);