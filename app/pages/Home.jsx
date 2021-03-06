import React from "react";
import {CardHome} from "components/Card.jsx";
// import Select from "react-select";
import api from "helpers/api.js";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      suggestions: [],
      suggestionsVisible: true,
      active: null,
      searchResults: [],
      filter: "All"
    };
    this.countries = [
      {type: "country", name: "Brazil", continent: "South America", id: "sabra", flickr_link: "https://flic.kr/p/g2TM9U"},
      {type: "country", name: "USA", continent: "North America", id: "nausa", flickr_link: "https://flic.kr/p/8CZkZ7"},
      {type: "country", name: "Italy", continent: "Europe", id: "euita", flickr_link: "https://flic.kr/p/gonJ3Y"},
      {type: "country", name: "Vietnam", continent: "Asia", id: "asvnm", flickr_link: ""},
      {type: "country", name: "Cote d'Ivoire", continent: "Africa", id: "afciv", flickr_link: "https://flic.kr/p/dd4Jxb"}
    ];
    this.products = [
      {type: "product", name: "Wine", category: "Foodstuffs", id: "042204", flickr_link: "https://flic.kr/p/a7awbU"},
      {type: "product", name: "Sheep and Goats", category: "Animal Products", id: "010104", flickr_link: null},
      {type: "product", name: "Fork-Lifts", category: "Machines", id: "168427", flickr_link: "https://flic.kr/p/6ybFaY"},
      {type: "product", name: "Coffee", category: "Foodstuffs", id: "020901", flickr_link: "https://flic.kr/p/aiHENe"},
      {type: "product", name: "Computers", category: "Machines", id: "168471", flickr_link: "https://flic.kr/p/4jcppM"},
      {type: "product", name: "Electrical Transformers", category: "Machines", id: "168504", flickr_link: "https://flic.kr/p/6Bfnmw"}
    ];
    this.companies = [
      {id: "cabo-virgenes-espana-6870", type: "company", name: "Cabo Vírgenes", logo: "https://storage.googleapis.com/mm-company/company/company6870-fondo_01.jpg"},
      {id: "olivus-floris", type: "company", name: "Olivus Floris", logo: "https://olivusfloris.com/wp-content/uploads/elementor/thumbs/logo-o4tj55vdhvjkb4zkx2ex6dfl9a90n525j4y86z5tsu.png"},
      {id: "sheabutter-guys-uk-limited", type: "company", name: "sheabutter guys UK Limited", logo: "https://storage.googleapis.com/mm-company/company/company254-official-logo.png"},
      {id: "dobropole", type: "company", name: "DOBROPOLE", logo: "https://storage.googleapis.com/mm-company/company/company284-ukrainian_flag-wallpaper-1024x1024.jpg"},
      {id: "inversiones-martinez-perez", type: "company", name: "Inversiones Martinez Perez", logo: "https://storage.googleapis.com/mm-company/company/company6056-logo-cuadrado.jpeg"},
      {id: "shaylan-group", type: "company", name: "Shaylan Group", logo: "https://storage.googleapis.com/mm-company/company/company271-shaylan.png"},
      {id: "mutara-africa-link-technologies", type: "company", name: "Mutara Africa Link Technologies", logo: "https://storage.googleapis.com/mm-company/company/company6023-mutara-logo-design.png"}

      // {id: "chaochomvarnish-coltd", type: "company", name: "Chaochomvarnish Co.", logo: "https://storage.googleapis.com/mm-company/company/company277--.jpg"},

      // {id: "planet-port-export-and-imports", type: "company", name: "Planet Port Export and Imports", logo: "https://storage.googleapis.com/mm-company/company/company291-planet-port-logo_final-1-paint.jpg"}

      // {id: "shenzhen-wangjing-printing-coltd", type: "company", name: "Shenzhen Wangjing Printing", logo: "https://storage.googleapis.com/mm-company/company/company251-img_2104s.jpg"}
      // {id: "algeria-universal-export", type: "company", name: "Algeria Universal Export", logo: "https://storage.googleapis.com/mm-company/company/company287-a.jpg"},

      // {type: "company", name: "Al Hafar Transport", id: "al-hafar-transport-and-cont-llc-1", logo: "https://storage.googleapis.com/mm-company/company/company259-cat-966h.jpg"}
      // {type: "company", name: "Kandil Egypt Lighting", id: "kandil-egypt-for-chandeliers-and-decorative-lighting", logo: "https://storage.googleapis.com/mm-company/company/company255-kandil-logo-english.jpg"},
      // {type: "company", name: "Al Hafar Transport", id: "al-hafar-transport-and-cont-llc-1", logo: "https://storage.googleapis.com/mm-company/company/company259-cat-966h.jpg"},
      // {type: "company", name: "SML Fibrex", id: "sml-fibrex", logo: "https://storage.googleapis.com/mm-company/company/company261-sml-fibrex-logo.png"},
      // {type: "company", name: "Alk Trading LLC", id: "alk-trading-llc", logo: "https://storage.googleapis.com/mm-company/company/company223-6_primary_logo_on_color2_5000.png"},
      // {type: "company", name: "Apu Café", id: "apu-sas", logo: "https://storage.googleapis.com/mm-company/company/company222-logo-apu.png"},
      // {type: "company", name: "Azexporter", id: "azexporter", logo: "https://storage.googleapis.com/mm-company/company/company184-home-banner-shipping.jpg"},
      // {type: "company", name: "OSSA Productos Orgánicos", id: "ossa-productos-organicos", logo: "https://storage.googleapis.com/mm-company/company/company198-ossa-2.jpg"},

      // {type: "company", name: "Sidick General Trading", id: "sidick-general-trading-m-sdn-bhd", logo: "https://storage.googleapis.com/mm-company/company/company195-fb-cover.jpg"},
      // {type: "company", name: "W3 Holding Trading Corp.", id: "w3-holding-trading-corp", logo: "https://storage.googleapis.com/mm-company/company/company162-logo-w3h-origami-02-copy.png"},
      // {type: "company", name: "TFO Canada", id: "ca_42795", logo: "https://d3pl7mm70gk6ic.cloudfront.net/sites/default/files/styles/mobile_full_width/public/company-42795-1478811748.png"}
    ];
  }

  selectSuggestion = suggestion => {
    const {router} = this.props;
    const type = suggestion.profile_type === "connectamericas"
      ? "company"
      : suggestion.profile_type;
    router.push(`/${type}/${suggestion.id}`);
  }

  search = (searchTerm, filter) => {
    // this.props.setSearch({keyword: this.state.keyword, filter: this.state.selected.value});
    // this.props.fetchSearch(this.state.keyword, this.state.selected.value.toLowerCase());
    // this.props.activateSearch();
    api.get(`/api/search/${filter}/${searchTerm}`)
      .then(response => {
        this.setState({searchResults: response.data});
      })
      .catch(response => {
        console.log("err:", response);
      });
  }

  hover = button => {
    this.setState({active: button});
  }

  selectDropDown = item => {
    this.setState({selected: item});
  }

  handleChange = e => {
    this.setState({
      suggestionsVisible: true,
      keyword: e.target.value
    });
    const {filter} = this.state;

    // Only run the search if the user has typed MORE than 2 characters,
    // otherwise this returns way too many results and feels laggy.
    //  - else
    // clear the results but submitting an empty string
    if (e.target.value.length > 2) {
      this.search(e.target.value, filter.toLowerCase());
    }
    else {
      this.search("", filter.toLowerCase());
    }
  }

  selectSuggestion = suggestion => {
    const {router} = this.props;
    const type = suggestion.profile_type === "connectamericas"
      ? "company"
      : suggestion.profile_type;
    router.push(`/${type}/${suggestion.id}`);
  }

  render() {
    const {filter, searchResults} = this.state;
    const options = [
      {value: "All", label: "All"},
      {value: "Company", label: "Companies"},
      {value: "Country", label: "Countries"},
      {value: "Product", label: "Products"}
    ];

    return <div className="home-background">
      <div className="home">
        <div className="content-wrapper">
          <div className="header-wrapper">
            <div className="home-logo">
              <img src="/images/macro-market-logo-yellow.png" />
            </div>
            <p className="tagline">Market for exported and imported goods.</p>
          </div>
          <div className="search-wrapper">
            <div className="search-input-wrapper">
              <input onChange={this.handleChange} value={this.state.keyword} className="search-input" placeholder="Enter a Search" type="text" />
              {searchResults.length > 0
                ? <ul className="suggestions-wrapper">
                  {searchResults.map((suggestion, i) =>
                    <li key={i} onClick={this.selectSuggestion.bind(this, suggestion)} className="dropdown-item">
                      <img className="icon" src={suggestion.profile_type === "Country"
                        ? "/images/icons/icon-country-yellow.svg"
                        : suggestion.profile_type === "Product"
                          ? "/images/icons/icon-product-yellow.svg"
                          : "/images/icons/icon-company-yellow.svg"}/>
                      <p>{`${suggestion.name} |
                      ${suggestion.profile_type === "connectamericas" ? "company" : suggestion.profile_type}`}</p>
                    </li>
                  )}
                </ul>
                : null}
            </div>
            <select className="Select" onChange={evt => this.setState({filter: evt.target.value})} value={filter}>
              {options.map(option => <option key={option.value} value={option.value}>{option.value}</option>)}
            </select>
          </div>

          <div className="logos-wrapper">
            <p>Created in Collaboration</p>
            <div className="img-wrapper">
              <a href="https://connectamericas.com/" rel="noopener noreferrer" target="_blank"><img className="connect" src="/images/icons/logos/connectAmericasLogo.png" alt="IADB Connect Americas Logo" /></a>
              <a href="https://www.media.mit.edu/groups/collective-learning/overview/" rel="noopener noreferrer" target="_blank"><img className="collective-learning" src="/images/icons/logos/collective-learning.png" alt="Collective Learning Logo" /></a>
              <a href="https://www.media.mit.edu/" rel="noopener noreferrer" target="_blank"><img className="media-lab" src="/images/icons/logos/mit-media-lab.png" alt="MIT Media Lab Logo" /></a>
              <a href="http://www.datawheel.us/" rel="noopener noreferrer" target="_blank"><img className="datawheel" src="/images/icons/logos/datawheel.png" alt="Datawheel Logo" /></a>
            </div>
          </div>
          <div className="grid-wrapper">
            <div className="countries row">
              <h3>Countries</h3>
              {this.countries.map(c => <CardHome key={c.id} content={c} />)}
            </div>
            <div className="products row">
              <h3>Products</h3>
              {this.products.map(p => <CardHome key={p.id} content={p} />)}
            </div>
            <div className="companies row">
              <h3>companies</h3>
              {this.companies.map(c => <CardHome key={c.id} content={c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Home;
