import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableRow} from '@material-ui/core';
import NumberFormat from 'react-number-format';

const StyledTableRow = withStyles(theme => ({
  root: {
    height: 20
  },
}))(TableRow);

const CustomCell = withStyles({
  root: {
		fontSize: 12,
		padding: 2,
  },
})(TableCell);

function subtotal(items, colum) {
	if(colum.nat_type === 'number'){
		return items.map((item) => parseFloat(item[colum.nat_autonumber])).reduce((sum, i) => sum + i, 0);
	}
	else if(colum.nat_type === 'currency'){
		return <NumberFormat value={
			(items.map((item) => parseFloat(item[colum.nat_autonumber])).reduce((sum, i) => sum + i, 0)).toFixed(2)
			} displayType={'text'} thousandSeparator={','} decimalSeparator={'.'} prefix={'R$'} />
	}
	else {
		return null;
	}
}

class DynamicSum extends React.Component {

	render() {
		return (
			<StyledTableRow>
				<CustomCell className="readonly" style={{ padding:'6px 12px' }}>
					Totais
				</CustomCell>
				{this.props.columns.map((colum, index) => (
					colum.nat_total === true ? (
						<CustomCell className="readonly" style={{ padding:'4 56 4 24' }} key={colum.nat_autonumber + index}>
							{subtotal(this.props.data, colum)}
						</CustomCell>				
					) : (
						<CustomCell className="readonly" style={{ padding:'4 56 4 24' }} key={colum.nat_autonumber + index}></CustomCell>	
					)		
                    ),
                    this,
                )}	
			</StyledTableRow>
		);
	}
}

export default DynamicSum;