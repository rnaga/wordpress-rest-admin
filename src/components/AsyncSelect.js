import React from 'react';
import Select, {Creatable} from 'react-select';
import '../styles/react-select.css';

class AsyncSelect extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            value: this.props.multi ? [] : undefined,
            isLoading: false,
            options: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.asyncOptions = this.asyncOptions.bind(this);
    }
 
    componentWillMount(){

        const {asyncDefaultOptions, defaultValue} = this.props;
        const _self = this;

        if(typeof asyncDefaultOptions === 'function'){
            asyncDefaultOptions()
              .then(options => {
                  _self.defaultOptions = options;
                  _self.setState({isLoading: false, options: _self.defaultOptions});
              })
        }

        this.setState({value: defaultValue });
    } 
 
    handleChange (value) {

        const {onChange} = this.props;

        if(typeof onChange === 'function')
            onChange(value);

        this.setState({value});
    }

    // Load options dynamically
    handleInputChange(e){

        const {isLoading} = this.state;
        const value = e.target.value;

        if((value.length < 2 || isLoading || e.keyCode === 13))
            return;

        this.asyncOptions(value);
    }

    asyncOptions(value = ''){

        const _self = this;
        const {asyncInputChange} = this.props;

        this.setState({isLoading: true});

        asyncInputChange(value)
          .then(options => {
              _self.setState({isLoading: false, options});
          })
    }

    render(){

        const {value, isLoading, options} = this.state;
        const {style: _style = {}, multi = true, creatable = false, label, ...rest} = this.props;   

        const SelectComponent = creatable ? Creatable : Select;

  	//		options: [
	//			{ value: 'R', label: 'Red' },
	//			{ value: 'G', label: 'Green' },
	//			{ value: 'B', label: 'Blue' }
	//		],

        const style = Object.assign({width: '50%'}, _style);

        return (
          <div style={style}>
            <label style={{fontSize: '0.775rem', color: 'rgba(0, 0, 0, 0.54)'}}>{label}</label>
            <SelectComponent
              {...rest}
              multi={multi}
              onBlur={e => this.setState({options: this.defaultOptions})}
              options={options}
              onChange={this.handleChange}
              onInputKeyDown={e => this.handleInputChange(e)}
              value={value}
              isLoading={isLoading}
            />
          </div>);
    }
}

export default AsyncSelect;




