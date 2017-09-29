import React from "react";
import "./TradeEdit.css";
import {Classes, MenuItem} from "@blueprintjs/core";
import {MultiSelect} from "@blueprintjs/labs";

class CountrySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: props.countries
    };
  }

  getSelectedCountryIndex = country => this.state.countries.findIndex(t => t.id === country.id);
  isCountrySelected = country => this.state.countries.findIndex(c => c.id === country.id) > -1;

  renderCountry = ({handleClick, isActive, item: country}) =>
    <MenuItem
      className={isActive ? Classes.ACTIVE : ""}
      iconName={this.isCountrySelected(country) ? "tick" : "blank"}
      key={country.id}
      label={country.id_3char ? country.id_3char.toUpperCase() : ""}
      onClick={handleClick}
      text={`${country.name}`}
      shouldDismissPopover={false}
    />

  handleCountrySelect = country => {
    if (!this.isCountrySelected(country)) {
      this.selectCountry(country);
    }
    else {
      this.deselectCountry(this.getSelectedCountryIndex(country));
    }
  }

  selectCountry = country => {
    const {selectCountry} = this.props;
    const countries = [...this.state.countries, country];
    selectCountry(countries);
    this.setState({countries});
  }

  deselectCountry = index => {
    this.setState({countries: this.state.countries.filter((_country, i) => i !== index)});
  }

  deleteTag = (el, index) => {
    this.setState({countries: this.state.countries.filter((_country, i) => i !== index)});
  }

  renderTag = f => {
    const continent = f.continent.toLowerCase().replace(" ", "-");
    return <span className={`color-${continent}`}>{f.name}</span>;
  }

  filterCountry = (query, country) => `${country.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;

  render() {
    const {allCountries} = this.props;
    const {countries} = this.state;
    return (
      <MultiSelect
        items={allCountries}
        itemRenderer={this.renderCountry}
        itemPredicate={this.filterCountry}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={this.handleCountrySelect}
        tagInputProps={{tagProps: a => ({className: a.props.className}), onRemove: this.deleteTag}}
        tagRenderer={this.renderTag}
        selectedItems={countries}
        resetOnClose={true}
        resetOnSelect={true}
      />
    );
  }
}
export default CountrySelection;
