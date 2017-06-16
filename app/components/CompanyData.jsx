import React from "react";
import Dropdown from "./DropDown.jsx";
import {connect} from "react-redux";
import {fetchCountries} from "../actions/countriesActions";
import "./Form.css";
import {Link} from "react-router";
import {browserHistory} from "react-router";
import Select from 'react-select';
import "../components/Dropdown.css";
import {uploadImage, saveCompany2, deleteCompany} from "../actions/userActions";
import {countryInputChange, arrowRenderer, countryValueRenderer, countryOptionRenderer} from "../components/Dropdown";

class CompanyData extends React.Component {
  constructor(props) {
    super(props);
    const defaultCompany =  {
      profile_image: null,
      cover_image: null,
      name: "",
      address: "",
      city: "",
      region: "",
      phone_number: "",
      website: "",
      description: "",
      user_id: this.props.user.id
    }
    let country = {value: null, label: null};
    if(this.props.company) {
      if(this.props.company.Country) {
        country = {
          value: this.props.company.Country.id, label: this.props.company.Country.name
        };
      }
    }

    let profileImage = null;
    if(this.props.company) {
      if(this.props.company.profile_image) {
        profileImage = `url(${this.props.company.profile_image})`;
      }
    }

    let coverImage = null;
    if(this.props.company) {
      if(this.props.company.cover_image) {
        coverImage = `url(${this.props.company.cover_image})`;
      }
    }

    this.state = Object.assign(this.props.company || defaultCompany, {
      country,
      profileImage,
      coverImage,
      websiteError: null,
      nameError: null,
      addressError: null,
      cityError: null,
      regionError: null,
      phoneError: null
    });

  }

  componentWillMount() {
    this.props.updateSave();
    this.props.fetchCountries();
  }

  validateWebsite(url) {
    var re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    return re.test(url);
  }

  handleChange(e) {
    const value = e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value;
    this.setState({
      company: {
        ...this.state.company,
        [e.target.name]: value
      }
    });
  }

  handleImageChange = e => {
    // e.persist();
    // const reader = new FileReader();
    // const file = e.target.files[0];
    //
    // reader.onloadend = () => {
    //   this.setState({
    //     [e.target.name]:
    //          `url(${reader.result})`
    //     },
    //     [e.target.name]: file
    //   });
    // };
    // reader.readAsDataURL(file);
  }

  selectDropDown = country => {
    this.setState({country : {value: country.value, label : country.label}});
  }

  saveCompany = () => {
    let company = {
        id: this.state.company.id,
        name: this.state.company.name,
        address:  this.state.company.address,
        city:  this.state.company.city,
        region:  this.state.company.name,
        phone_number:  this.state.company.phone_number,
        website:  this.state.company.website,
        description:  this.state.company.description,
        cover_image:  this.state.company.cover_image,
        profile_image:  this.state.company.profile_image,
        user_id: this.props.user.id
    };

    company.country_id = this.state.country.value;
    this.setState({websiteError: null});
    this.setState({nameError: null});
    this.setState({addressError: null});
    this.setState({cityError: null});
    this.setState({regionError: null});
    this.setState({phoneError: null});
    if (company.name.length === 0) {
      this.setState({nameError: "Company name is required."});}
    else if (!this.validateWebsite(this.state.company.website)) {
      this.setState({websiteError: "Must enter a valid website."});
    }
     else if (company.name.length > 255) {
      this.setState({nameError: "Must be fewer than 255 characters."});
    } else if (company.website.length > 255) {
      this.setState({websiteError: "Must be fewer than 255 characters."});
    } else if (company.address.length > 255) {
      this.setState({addressError: "Must be fewer than 255 characters."});
    } else if (company.city.length > 255) {
      this.setState({cityError: "Must be fewer than 255 characters."});
    } else if (company.region.length > 255) {
      this.setState({regionError: "Must be fewer than 255 characters."});
    } else if (company.phone_number.length > 255) {
      this.setState({phoneError: "Must be fewer than 255 characters."});
    } else {
      company.country = this.state.country;
      this.props.saveCompany(company, this.state.profile_image, this.state.cover_image);
        window.scrollTo(0, 0);
    }
  }

  render() {
    const {loading, error, countries} = this.props;
    if (error) {
      return (
        <div className="detailed-content-wrapper">
          <h2>Error</h2>
          <p>Please refresh the page.</p>
        </div>
      );
    }

    if (loading || !countries) {
      return (
        <div className="detailed-content-wrapper">
          <div>loading...</div>
        </div>
      );
    }

    if(this.props.companySaved) {
      return(
        <div className="register-company">
          <img src="/images/icons/icon-registration.svg"></img>
          <p>Your Company was Saved Sucessfully!</p>
          <Link to={`/company/${this.props.companySaved}`}>
            <button className=" button button-next">View Listing</button>
          </Link>
        </div>
      )
    }

    const dropDownCountries = [];
    countries.map(continent => {
      let first = true;
      continent.values.map(country => {
        dropDownCountries.push({continent:continent.key, value: country.id, label: country.name, first});
        first = false;
      });
    });

    const {name, address, city, region, phone_number, website, description, profileImage, coverImage} = this.state;


    return (
      <div className="section-wrapper company-data">
        {this.props.company
          ? <div>
              <b>Edit Your Company</b>
            </div>
          : <div>
            <b>Register a Company</b>
          </div>}
        <div className="content-wrapper">
          <div className="col">
            <div className="input-wrapper">
              <label>Company Name</label>
              <input onChange={this.handleChange} value={name} name="name"/>
              <div className="error-wrapper">
                <p>{this.state.nameError}</p>
              </div>
            </div>
            <div className="input-wrapper">
              <label>Address</label>
              <input onChange={this.handleChange} value={address} name="address"/>
              <div className="error-wrapper">
                <p>
                  {this.state.addressError}</p>
              </div>
            </div>
            <div className="input-wrapper">
              <label>City</label>
              <input onChange={this.handleChange} value={city} name="city"/>
              <div className="error-wrapper">
                <p>{this.state.cityError}</p>
              </div>
            </div>
            <div className="input-wrapper">
              <label>State/Provience/Region</label>
              <input onChange={this.handleChange} value={region} name="region"/>
              <div className="error-wrapper">
                <p>{this.state.regionError}</p>
              </div>
            </div>
            <div className="input-wrapper">
              <label>Country</label>
              <Select onInputChange={countryInputChange} valueRenderer={countryValueRenderer} optionClassName={"dropdown-option"}
                optionRenderer={countryOptionRenderer} arrowRenderer={arrowRenderer} clearable={false}
                name="form-field-name" value={this.state.country.value} options={dropDownCountries} onChange={this.selectDropDown}/>
            </div>
            <div className="input-wrapper">
              <label>Phone</label>
              <input onChange={this.handleChange} value={phone_number} name="phone_number"/>
              <div className="error-wrapper">
                <p>{this.state.phoneError}</p>
              </div>
            </div>
            <div className="input-wrapper">
              <label>Website</label>
              <input onChange={this.handleChange} value={website} name="website"/>
              <div className="error-wrapper">
                <p>{this.state.websiteError}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <label>Description</label>
            <textarea rows="8" onChange={this.handleChange} value={description} name="description"/>
            <div className="profile-image-wrapper input-wrapper">
              <div className="image-preview-wrapper">
                {profileImage
                  ? <div className="image-preview" style={{backgroundImage: profileImage}}></div>
                  : null}
              </div>
              <div className="image-upload">
                <p>Upload a photo</p>
                <input name="profile_image" onChange={this.handleImageChange} type="file"/>
              </div>
            </div>
            <div className="cover-image-wrapper input-wrapper">
              <div className="image-preview-wrapper">
                {coverImage
                  ? <div className="image-preview" style={{backgroundImage: coverImage}}></div>
                  : null}
              </div>
              <div className="image-upload">
                <p>Upload a photo</p>
                <input name="cover_image" onChange={this.handleImageChange} type="file"/>
              </div>
            </div>

            <div className="button-wrapper">
              <button className=" button button-next" onClick={this.saveCompany}>Save
              </button>
              {this.props.companySaved
                ?
                <div className="error-wrapper">
                  <p>Company Saved Sucessfully!</p>
                </div>
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCountries: () => {
      dispatch(fetchCountries());
    },
    saveCompany: (company, profileImage, coverImage) => {
      dispatch(saveCompany2(company, profileImage, coverImage));
    },
    updateSave: () => {
      dispatch({type: "SAVE_FULFILLED", data: null});
    }
  };
};

const mapStateToProps = state => {
  return {
    company: state.companyProfile.authCompany,
    user: state.authentication.user,
    companyLoading: state.user.loading,
    companySaved: state.user.company,
    deleted: state.companyProfile.deleted,
    countries: state.countries.countries,
    loading: state.countries.loading,
    error: state.countries.error || null
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyData);
