import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';

const CssTextField = withStyles({
    root: {
        margin: 0,
        padding: 0,
        font: "unset",
        fontSize: 12
    }
})(TextField);

const CustomButton = withStyles({
    root: {
        fontSize: 12,
        padding: '3px 6px'
    }
})(Button);

const CustomCell = withStyles({
    root: {
        fontSize: 12
    }
})(TableCell);

class DynamicCell extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick = (key, item) => event => {
        if (item.nat_onclick !== null && item.nat_onclick !== "") {
            this.props.func[item.nat_onclick](key, this.props.item, this.changeProperty, this.setEditable);
        }
    }

    handleChange = (key, item) => event => {
        this.props.item[item.nat_autonumber] = event.target.value;
        this.setState(this.props.item);

        if (item.nat_onchange !== null && item.nat_onchange !== "") {
            this.props.func[item.nat_onchange](key, this.props.item, this.changeProperty, this.setEditable);
        }
    };

    changeProperty = (key, value) => {
        this.props.item[key] = value;
        this.setState(this.props.item);
    }

    setEditable = (item, key) => {

        if (item.edit) {
            if (item.edit.includes(key)) {
                var itens = item.edit.filter(item => item !== key);
                item.edit = itens;
            }
            else {
                item.edit.push(key);
            }
        }
        else {
            item.edit = [key];
        }

        this.setState(this.props.item);
    }

    render() {

        return this.props.columns.map((item, index) => {
            if (!item.hasOwnProperty("nat_exibition") || item.nat_exibition !== false) {
                if (item.nat_readonly === false || (this.props.item.edit && this.props.item.edit.includes(item.nat_autonumber))) {
                    switch (item.nat_type) {
                        case 'int':
                        case 'decimal':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'onClickClass' : null}>
                                    <CssTextField
                                        key={item.nat_autonumber + index}
                                        value={this.props.item[item.nat_autonumber]}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        min={item.props[0].minNumber}
                                        max={item.props[0].maxNumber}
                                        margin="normal"
                                        onChange={this.handleChange(item.nat_autonumber, item)}
                                        required
                                        autoFocus
                                    />
                                </CustomCell>
                            );
                        case 'float':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'onClickClass' : null}>
                                    <CssTextField
                                        key={item.nat_autonumber + index}
                                        value={this.props.item[item.nat_autonumber]}
                                        onChange={this.handleChange(item.nat_autonumber, item)}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom
                                        }}
                                        required
                                        autoFocus
                                    />
                                </CustomCell>
                            );
                        case 'date':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'onClickClass' : null}>
                                    <CssTextField
                                        key={item.nat_autonumber + index}
                                        type="date"
                                        onChange={this.handleChange(item.nat_autonumber, item)}
                                        value={this.props.item[item.nat_autonumber]}
                                        required
                                        autoFocus
                                    />
                                </CustomCell>
                            );
                        case 'button':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <CustomButton size="small" variant="contained" color="primary" key={item.nat_autonumber + index}>
                                        {this.props.item[item.nat_autonumber]}
                                    </CustomButton>
                                </CustomCell>
                            );
                        case 'link':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <CustomButton href={this.props.item[item.nat_autonumber]} size="small" target="blank" key={item.nat_autonumber + index}>
                                        Link
                            </CustomButton>
                                </CustomCell>
                            );
                        case 'select':
                            return (
                                <CustomCell key={item.nat_autonumber + index} align="left" onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'onClickClass' : null}>
                                    <CssTextField
                                        key={item.nat_autonumber + index}
                                        select
                                        value={this.props.item[item.nat_autonumber]}
                                        required
                                        autoFocus
                                        onChange={this.handleChange(item.nat_autonumber, item)}
                                    >
                                        {item.props[0].options.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.displayText}
                                            </MenuItem>
                                        ))}
                                    </CssTextField>
                                </CustomCell>
                            );
                        default:
                            return (
                                <CustomCell key={item.nat_autonumber + index} align="left" onClick={this.handleClick(item.nat_autonumber, item, index)} className={item.nat_onclick ? 'onClickClass' : null}>
                                    <CssTextField
                                        key={item.nat_autonumber + index}
                                        value={this.props.item[item.nat_autonumber]}
                                        onChange={this.handleChange(item.nat_autonumber, item)}
                                        margin="normal"
                                        autoFocus
                                        required
                                        className={'without-padding'}
                                    />
                                </CustomCell>
                            );
                    }
                }
                else {
                    switch (item.nat_type) {
                        case 'int':
                        case 'decimal':
                            return (
                                <CustomCell key={item.nat_autonumber + index} className="readonly" onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    {this.props.item[item.nat_autonumber]}
                                </CustomCell>
                            );
                        case 'float':
                            return (
                                <CustomCell key={item.nat_autonumber + index} className="readonly" onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <NumberFormat value={this.props.item[item.nat_autonumber]} displayType={'text'} thousandSeparator={','} decimalSeparator={'.'} prefix={'R$'} />
                                </CustomCell>
                            );
                        case 'date':
                            var date = new Date(this.props.item[item.nat_autonumber]).toLocaleDateString('pt-BR');
                            return (
                                <CustomCell key={item.nat_autonumber + index} className="readonly" onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    {date}
                                </CustomCell>
                            );
                        case 'button':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className="readonly" className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <CustomButton size="small" variant="contained" color="primary" key={item.nat_autonumber + index}>
                                        {this.props.item[item.nat_autonumber]}
                                    </CustomButton>
                                </CustomCell>
                            );
                        case 'link':
                            return (
                                <CustomCell key={item.nat_autonumber + index} onClick={this.handleClick(item.nat_autonumber, item)} className="readonly" className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <CustomButton href={this.props.item[item.nat_autonumber]} size="small" target="blank">
                                        Link
								</CustomButton>
                                </CustomCell>
                            );
                        case 'select':
                            return (
                                <CustomCell key={item.nat_autonumber + index} className="readonly" onClick={this.handleClick(item.nat_autonumber, item)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={this.props.item[item.nat_autonumber]}
                                        disabled

                                    >
                                        {item.props[0].options.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.displayText}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </CustomCell>
                            );
                        default:
                            return (
                                <CustomCell key={item.nat_autonumber + index} align="left" onClick={this.handleClick(item.nat_autonumber, item, index)} className={item.nat_onclick ? 'readonly onClickClass' : 'readonly'}>
                                    {this.props.item[item.nat_autonumber]}
                                </CustomCell>
                            );
                    }
                }
            }
        });
    }
}

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            decimalSeparator={'.'}
            prefix="R$"
        />
    );
}


export default DynamicCell;