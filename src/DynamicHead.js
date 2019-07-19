import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

const StyledTableRow = withStyles(theme => ({
    root: {
        height: '30px'
    }
}))(TableRow);

const CustomCell = withStyles({
    root: {
        fontSize: 12
    }
})(TableCell);

class DynamicGridHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, data, deleted, selected, hasCount } = this.props;
        return (
            <TableHead>
                <StyledTableRow>
                    <CustomCell padding="checkbox" style={{ display: selected === false && !hasCount ? "none" : "" }}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount && rowCount > 0}
                            onChange={onSelectAllClick}
                            style={{ width: 'auto', height: 'auto', padding: 0, display: selected === false ? "none" : "" }}
                            icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />}
                            checkedIcon={<CheckBoxIcon style={{ fontSize: 20 }} />}
                            indeterminateIcon={<IndeterminateCheckBoxIcon style={{ fontSize: 20 }} />}
                        />
                    </CustomCell>
                    {
                        deleted ? <CustomCell key={data.length} /> : null
                    }
                    {data.map(
                        row =>
                            !row.hasOwnProperty("nat_exibition") || row.nat_exibition !== false ?
                                row.nat_order === true ?
                                    <CustomCell
                                        key={row.nat_autonumber}
                                        sortDirection={orderBy === row.nat_autonumber ? order : false}
                                        width={row.nat_width}
                                    >
                                        <Tooltip
                                            title="Ordenar"
                                            placement={'bottom-end'}
                                            enterDelay={300}
                                        >
                                            <TableSortLabel
                                                active={orderBy === row.nat_autonumber}
                                                direction={order}
                                                onClick={this.createSortHandler(row.nat_autonumber)}
                                            >
                                                {row.nat_exibitionnane}
                                            </TableSortLabel>
                                        </Tooltip>
                                    </CustomCell>
                                    :
                                    <CustomCell
                                        key={row.nat_autonumber}
                                        width={row.nat_width}
                                    >
                                        {row.nat_exibitionnane}
                                    </CustomCell>
                                : null
                        ,
                        this,
                    )}
                </StyledTableRow>
            </TableHead>
        );
    }
}

export default DynamicGridHead;