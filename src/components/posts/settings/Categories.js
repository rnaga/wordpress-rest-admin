import React from 'react';
import {compose} from 'recompose';
import {Field} from 'redux-form';

import CheckboxesField from '../../forms/CheckboxesField';
import SearchBox from '../../SearchBox';
import withHttp from '../../../hoc/withHttp';
import httpNormalizeResponseBody from '../../../util/httpNormalizeResponseBody';
import httpGetHeaders from '../../../util/httpGetHeaders';
import IconActionButton from '../../IconActionButton';
import wpUrl from '../../../util/wpUrl';

const categoriesPerPage = 100;

class Categories extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchKeyword: "",
            categories: [],
            values: [],
        };

        this.categoriesTotalPages = 1;
        this.categoriesPage = 1;

        this.httpCategories();
    }

    componentWillMount(){
        const {edit} = this.props;

        const values = edit && Array.isArray(edit.categories) 
                     ? edit.categories : [];

        this.setState({values});
    }

    httpCategories(options){

        const {http} = this.props;
        const url = wpUrl().path('categories').query({
            order: 'desc',
            orderBy: 'id',
            page: this.categoriesPage++,
            per_page: categoriesPerPage,
        }).url;

        var _self = this;

        http('_categories', {
            url,
            method: 'GET',
            onSuccess: (response) => {
                const headers = httpGetHeaders({response});
                const body = httpNormalizeResponseBody({response});

                if(!body) return;

                _self.categoriesTotalPages = parseInt(headers['x-wp-totalpages'], 10);
                _self.setState({categories: [..._self.state.categories, ...body]});
            }
        });
    }

    search(keyword){

        const {categories} = this.state;
        var results = [];

        categories.forEach( item => {
            const {id, name} = item;
            if(this.state.values.indexOf(parseInt(id, 10)) >= 0 || name.match(new RegExp(keyword, 'i')))
                results.push(item);
        });

        return results;
    }

    handleInputChange(values){
        this.setState({values});
    }

    render() {

        const {searchKeyword, categories, values} = this.state;
//        const {edit} = this.props; 

        const _self = this;
 
        const _categories = (0 >= searchKeyword.length) 
                        ? categories
                        : this.search(searchKeyword);
    
        const items = _categories.map( (item, i) => {
            return {value: item.id, label: item.name}
        });
  
        return (<div>
          {categories.length > 10 && (
          <div style={{display: 'block', flex: 1, paddingBottom: 10}}>
          <SearchBox
            style={{width: '100%'}}
            onChange={ e => {
                _self.setState({searchKeyword: e.target.value})
            }}
         />
         </div>)}
           <div style={{border: '1px solid #aaa'}}>
            <div style={{overflowY: 'auto', height: 200}} >

              <Field 
                component={CheckboxesField} 
                id="categories" 
                name="categories" 
                label="Categories" 
                items={items}
                values={values} 
                onChecked={v => parseInt(v, 10)}
                onInputChange={this.handleInputChange.bind(this)}            
              />

                {this.categoriesTotalPages >= this.categoriesPage && (
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                  <IconActionButton 
                    type='KeyboardArrowDown' 
                    onClick={this.httpCategories.bind(this)} />
                </div>
               )}
            </div>
           </div>
        </div>);
    }

}

export default compose(
    withHttp(),
)(Categories);


