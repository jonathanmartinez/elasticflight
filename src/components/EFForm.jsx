import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlaceInput from './PlaceInput.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
const OPTIONS = require('../utils/options'); //options for select dropdowns

//Component to handle the main Elastic Flight form.
export default class EFForm extends React.Component {
  constructor(props) {
    super(props);

    const d = new Date();
    this.state = {
      month: {value:("0" + (d.getMonth() + 2)).slice(-2), label: "Next month"}, //Current month in 2-digit format
      year: {value: d.getFullYear(), label:d.getFullYear()},
      passengers: 1,
      originPlace: {PlaceId: "", PlaceName: "Country, city or airport..."},
      destinationPlace: {PlaceId: "", PlaceName: "Country, city or airport..."},
      formValidationStarted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object,
    label: React.PropTypes.string,
    searchable: React.PropTypes.bool,
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSelectChange(name) {
    return function(newValue) {
        this.setState({[name]: newValue || {PlaceId: "", PlaceName: "Country, city or airport..."}});
    }.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if(!this.state.originPlace.PlaceId){
      this.setState({formValidationStarted: true});
      return false;
    }

    if(!this.state.destinationPlace.PlaceId){
      this.setState({formValidationStarted: true});
      return false;
    }

    this.context.router.history.push(`/results/${this.state.originPlace.PlaceId}/${this.state.destinationPlace.PlaceId}/${this.state.year.value}-${this.state.month.value}/${this.state.passengers}`);
  }

  render() {
    const originPlace = this.state.originPlace;
    const destinationPlace = this.state.destinationPlace;
    let years = [];
    let d = new Date();
    //current year +3
    for (var i = 0; i < 3; i++) {
      let year = parseInt(d.getFullYear() + i);
      years.push({value: year, label: year});
    }

    return (
      <form onSubmit={this.handleSubmit} className="row">
        <div className="form-group col-xs-12 col-md-3">
          <label>Origin</label>
          <PlaceInput
            place={originPlace}
            autofocus={true}
            name="originPlace"
            onPlaceChange={this.handleSelectChange('originPlace')}
            className="form-control"
          />
          {/* Form validation message */}
          {
            !this.state.originPlace.PlaceId && this.state.formValidationStarted ?
            <span className="helpBlock text-danger"><i className="fa fa-times"></i> Origin is required</span>
            :
            null
          }
        </div>
        <div className="form-group col-xs-12 col-md-3">
          <label>Destination</label>
          <PlaceInput
            place={destinationPlace}
            onPlaceChange={this.handleSelectChange('destinationPlace')}
            className="form-control"
          />
          {/* Form validation message */}
          {
            !this.state.destinationPlace.PlaceId && this.state.formValidationStarted ?
            <span className="helpBlock text-danger"><i className="fa fa-times"></i> Destination is required</span>
            :
            null
          }
        </div>
        <div className="form-group col-xs-12 col-md-2">
          <label>Month</label>
          <Select options={OPTIONS.MONTHS} clearable={false} value={this.state.month} onChange={this.handleSelectChange('month')} />
        </div>
        <div className="form-group col-xs-6 col-md-1">
          <label>Year</label>
          <Select options={years} value={this.state.year} clearable={false} onChange={this.handleSelectChange('year')} />
        </div>
        <div className="form-group col-xs-6 col-md-1">
          <label>Passengers</label>
          <input type="number" min="1" name="passengers" value={this.state.passengers} onChange={this.handleInputChange} className="form-control" />
        </div>
        <div className="form-group col-xs-12 col-md-2">
          <label>&nbsp;</label>
          <button type="submit" className="btn form-control btn-ef">Search</button>
        </div>
      </form>
    );
  }
}
