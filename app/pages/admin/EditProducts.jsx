import React from "react";
import {connect} from "react-redux";
import {browserHistory} from "react-router";
import Sidebar from "../../components/Sidebar";
import {fetchData} from "datawheel-canon";
import api, {url} from "../../api";
import {Intent, Position, Toaster} from "@blueprintjs/core";
import "./Admin.css";
import "./Settings.css";
import TradeEdit from "./TradeEdit";

class EditProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trades: [],
      newProduct: false,
      unsavedTrades: false
    };
  }

  componentDidMount() {
    // console.log("TrAdes!", this.props.trades)
    // const {companyId} = this.props.params;
    this.setState({trades: this.props.trades});
  }

  handleChange = e => {
    const value = e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value;
    this.setState({
      [e.target.name]: value
    });
  };

  saveTrades = () => {
    const {newProduct, trades, unsavedTrades} = this.state;
    const {companyId} = this.props.params;
    const tradesForServer = [];
    if (!unsavedTrades || newProduct) {
      return;
    }
    trades.forEach(t => {
      if (!t.origins.length && !t.destinations.length) {
        tradesForServer.push({product: t.product, tradeFlow: "exports", country: null});
      }
      t.origins.forEach(o => {
        tradesForServer.push({product: t.product, tradeFlow: "imports", country: o});
      });
      t.destinations.forEach(d => {
        tradesForServer.push({product: t.product, tradeFlow: "exports", country: d});
      });
    });

    api.post(`/api/trades/company/${companyId}`, tradesForServer).then(tradesResponse => {
      const toast = Toaster.create({className: "company-saved-toast", position: Position.TOP_CENTER});
      toast.show({message: "Product trades updated.", intent: Intent.SUCCESS});
      console.log(tradesResponse.data);
      this.setState({unsavedTrades: false});
    });
  }

  addProduct = product => {
    const trades = this.state.trades.filter(t => t.product);
    const trade = {
      product,
      origins: [],
      destinations: []
    };
    this.setState({newProduct: false, trades: trades.concat([trade])});
    // this.saveTrades(trades.concat([trade]));
  }

  addOrigins = (origins, productId) => {
    const {trades} = this.state;
    const newTrades = trades.map(t => {
      if (t.product.id === productId) {
        t.origins = origins;
      }
      return t;
    });
    console.log("ADDING ORIGIN", productId, origins);
    this.setState({trades: newTrades});
  }

  addDestinations = (destinations, productId) => {
    const {trades} = this.state;
    const newTrades = trades.map(t => {
      if (t.product.id === productId) {
        t.destinations = destinations;
      }
      return t;
    });
    console.log("ADDING DESTS", productId, destinations);
    this.setState({trades: newTrades});
  }

  deleteProduct = p => {
    const {companyId} = this.props.params;
    const {trades} = this.state;

    api.delete(`/api/trades/company/${companyId}/product/${p.id}`).then(res => {
      this.setState({
        trades: trades.filter(t => t.product.id !== p.id)
      });
    });
  }

  toggleProductMenu = isOpen => this.setState({isOpen});

  appendProductRow = () => {
    // console.log(this.state.trades);
    if (!this.state.newProduct) {
      this.setState({
        unsavedTrades: true,
        newProduct: true,
        trades: this.state.trades.concat([{product: null, origins: [], destinations: []}])
      });
    }
  }

  render() {
    const {user, loading, products, countries} = this.props;
    const {newProduct, trades, unsavedTrades} = this.state;

    if (loading || !user) {
      return (
        <div className="settings">
          <Sidebar></Sidebar>
          <div className="center-content form-wrapper">
            <div className="form"></div>
          </div>
        </div>
      );
    }

    const path = this.props.location.pathname;
    return (
      <div>

        {/*
        <div className="pt-form-group">
          <p>...or browse and select from the list</p>
          <ProductBrowse products={products} selectProduct={this.addProduct} />
        </div>
        */}

        <table className="pt-table pt-bordered trades">
          <thead>
            <tr>
              <th>Product</th>
              <th>Export Destinations</th>
              <th>Import Origins</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) =>
              <TradeEdit
                key={i}
                trade={trade}
                countries={countries}
                selectProduct={this.addProduct}
                selectDestinations={this.addDestinations}
                selectOrigins={this.addOrigins}
                deleteProduct={this.deleteProduct}
              />
            )}
          </tbody>
        </table>

        <div>
          <button type="button" className={newProduct ? "pt-button pt-large pt-disabled" : "pt-button pt-large"} onClick={this.appendProductRow}>
            <span className="pt-icon-standard pt-icon-plus pt-align-left"></span>
            Add product
          </button>
          {/* <ProductPicker isOpen={isOpen} toggleProductMenu={this.toggleProductMenu} /> */}
        </div>

        <hr />

        <div>
          <button type="button" className={unsavedTrades && !newProduct ? "pt-button pt-intent-success pt-large" : "pt-button pt-intent-success pt-large pt-disabled"} onClick={this.saveTrades}>
            Save
            <span className="pt-icon-standard pt-icon-tick pt-align-right"></span>
          </button>
        </div>

      </div>
    );
  }
}

EditProducts.preneed = [
  fetchData("company", `${url}/api/companies/<companyId>`, res => res),
  fetchData("countries", `${url}/api/countries`, res => res),
  fetchData("products", `${url}/api/products`, res => res),
  fetchData("trades", `${url}/api/trades/company/<companyId>`, res => {
    const trades = [];
    res.forEach(t => {
      const prodRow = trades.find(tt => tt.product.id === t.product_id);
      const tKey = t.trade_flow === "imports" ? "origins" : "destinations";
      const tOtherKey = t.trade_flow === "imports" ? "destinations" : "origins";
      const country = t.Country ? [t.Country] : [];
      if (prodRow && country) {
        prodRow[tKey] = prodRow[tKey].concat(country);
      }
      else {
        trades.push({product: t.Product, [tKey]: country, [tOtherKey]: []});
      }
    });
    return trades;
  })
];

const mapStateToProps = state => ({
  company: state.data.company,
  countries: state.data.countries,
  products: state.data.products,
  trades: state.data.trades,
  user: state.authentication.user
});

export default connect(mapStateToProps)(EditProducts);
