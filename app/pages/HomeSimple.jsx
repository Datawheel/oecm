import React from "react";
import {CardHome} from "../components/Card.jsx";
import "./Home.css";
import {browserHistory} from "react-router";

class HomeSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      suggestions: [],
      suggestionsVisible: true,
      active: null
    };
  }

  selectSuggestion = suggestion => {
    const type = suggestion.profile_type === "connectamericas"
      ? "company"
      : suggestion.profile_type;
    browserHistory.push(`/${type}/${suggestion.id}`);
  }

  search = () => {
    this.props.setSearch({keyword: this.state.keyword, filter: this.state.selected.value});
    this.props.fetchSearch(this.state.keyword, this.state.selected.value.toLowerCase());
    this.props.activateSearch();
  }

  hover = button => {
    this.setState({active: button});
  }

  selectDropDown = item => {
    this.setState({selected: item});
  }

  render() {

    return (
      <div className="home-background">
        <div className="home">
          <div className="content-wrapper">
            <div className="header-wrapper">
              <div className="home-logo">
                <div className="oec-logo-wrapper">
                  <img className="mm-logo" src="/images/icons/logos/macro-market.svg"></img>
                </div>
                <img src="/images/icons/logos/orange-market-logo.svg"></img>
              </div>
              <p className="tagline">Market for exported and imported goods.</p>
            </div>
            <div className="search-wrapper"></div>

            <div className="logos-wrapper">
              <p>Created in Collaboration</p>
              <div className="img-wrapper">
                <img className="connect" src="/images/icons/logos/connectAmericasLogo.png" alt="IADB Connect Americas Logo" />
                <img className="collective-learning" src="/images/icons/logos/collective-learning.png" alt="Collective Learning Logo" />
                <img className="media-lab" src="/images/icons/logos/mit-media-lab.png" alt="MIT Media Lab Logo" />
                <img className="datawheel" src="/images/icons/logos/datawheel.png" alt="Datawheel Logo" />
              </div>
            </div>
            <div className="grid-wrapper">
              <div className="countries row">
                <h3>Countries</h3>
                <CardHome content={{
                  type: "country",
                  name: "Chile",
                  continent: "South America",
                  id: "sachl",
                  flickr_link: "https://flic.kr/p/g2TM9U"
                }}/>
                <CardHome content={{
                  type: "country",
                  name: "USA",
                  continent: "North America",
                  id: "nausa",
                  flickr_link: "https://flic.kr/p/8CZkZ7"
                }}/>
                <CardHome content={{
                  type: "country",
                  name: "Italy",
                  continent: "Europe",
                  id: "euita",
                  flickr_link: "https://flic.kr/p/gonJ3Y"
                }}/>
              </div>
              <div className="products row">
                <h3>Prdoucts</h3>
                <CardHome content={{
                  type: "product",
                  name: "Wine",
                  category: "Foodstuffs",
                  id: "042204",
                  flickr_link: "https://flic.kr/p/a7awbU"
                }}/>
                <CardHome content={{
                  type: "product",
                  name: "Sheep and Goats",
                  category: "Animal Products",
                  id: "010104",
                  flickr_link: null
                }}/>
                <CardHome content={{
                  type: "product",
                  name: "Fork-Lifts",
                  category: "Machines",
                  id: "168427",
                  flickr_link: "https://flic.kr/p/6ybFaY"
                }}/>
              </div>
              <div className="companies row">
                <h3>companies</h3>
                <CardHome content={{
                  type: "company",
                  name: "Corporacion Stealth Sac.",
                  id: "ca_66123",
                  logo: "https://d3pl7mm70gk6ic.cloudfront.net/sites/default/files/styles/mobile_full_width/public/company-66123-1498107298.png?itok=-foEqm3s"
                }}/>
                <CardHome content={{
                  type: "company",
                  name: "TFO Canada",
                  id: "ca_42795",
                  logo: "https://d3pl7mm70gk6ic.cloudfront.net/sites/default/files/styles/mobile_full_width/public/company-42795-1478811748.png?itok=Yoc2G5W"
                }}/>
                <CardHome content={{
                  type: "company",
                  name: "Visión Desarrollo Corporativo",
                  id: "ca_20576",
                  logo: "https://d3pl7mm70gk6ic.cloudfront.net/sites/default/files/styles/mobile_full_width/public/company-20576-1460152553.png?itok=p3mAe-pg"
                }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeSimple;