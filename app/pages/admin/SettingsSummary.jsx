import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import "./Admin.css";
import "./Settings.css";
import {isAuthenticated} from "datawheel-canon";
import api from "../../api.js";
import CompanyCard from "./CompanyCard";
import {nest} from "d3-collection";
// import UserData from "./UserData";

class SettingsSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: []
    };
  }

  // componentDidMount() {
  //   this.props.isAuthenticated();
  // }

  componentWillMount() {
    const {user} = this.props.auth;
    api.get(`api/companies/byUser/${user.id}`)
      .then(companiesResp => {
        const companies = companiesResp.data;
        api.get(`api/trades/user/${user.id}`)
          .then(tradesResp => {
            nest()
              .key(d => d.company_id)
              .key(d => d.product_id)
              .entries(tradesResp.data)
              .forEach(nestedTrades => {
                const thisCompany = companies.find(c => c.id.toString() === nestedTrades.key);
                thisCompany.trades = nestedTrades.values;
              });
            this.setState({companies});
          });
      });
  }

  render() {
    const {companies} = this.state;
    return (
      <div className="section-wrapper no-border listing">
        <h2>My Companies</h2>
        <div className="company-cards">
          {companies.map(company =>
            <CompanyCard key={company.id} company={company} />
          )}
        </div>
        <Link to="/settings/company/new" role="button" className="pt-button pt-icon-plus">
          New Company
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  isAuthenticated: () => {
    dispatch(isAuthenticated());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsSummary);
