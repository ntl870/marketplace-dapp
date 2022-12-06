import "./App.css";
import Web3 from "web3";
import { useEffect, useState } from "react";
import Marketplace from "./abis/MarketPlace.json";

function App() {
  const [marketPlace, setMarketPlace] = useState(null);
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      setMarketPlace(marketplace);
      const productCount = await marketplace.methods.productCount().call();
      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        setProducts((products) => [...products, product]);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const addProduct = async () => {
    try {
      await marketPlace.methods
        .addProduct(input.name, Web3.utils.toWei(String(input.price), "ether"))
        .send({
          from: account,
        });
    } catch (e) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  };

  const buyProduct = async (id, price) => {
    try {
      await marketPlace.methods.buyProduct(id).send({
        from: account,
        value: Web3.utils.toWei(String(price), "ether"),
      });
    } catch (e) {
      console.log(e);
    } finally {
      window.location.reload();
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <div>
          <input
            style={{ marginBottom: "1rem" }}
            className="form-control"
            type="text"
            name="name"
            placeholder="Product Name"
            onChange={(e) =>
              setInput((value) => ({
                ...value,
                name: e.target.value,
              }))
            }
          />
          <input
            placeholder="Product Price"
            style={{ marginBottom: "1rem" }}
            className="form-control"
            type="number"
            name="price"
            onChange={(e) =>
              setInput((value) => ({
                ...value,
                price: e.target.value,
              }))
            }
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={addProduct}>
          Add
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Purchased</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <th scope="row">{product.id}</th>
              <td>{product.name}</td>
              <td>{`${product.price / Math.pow(10, 18)} ETH`}</td>
              <td>{product.purchased ? "X" : ""}</td>

              <td>
                {!product.purchased && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      buyProduct(
                        Number(product.id),
                        Web3.utils.toWei(String(product.price), "ether")
                      )
                    }
                  >
                    Buy
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {products.map((product, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "row" }}>
          <h1>{`${product.name} - ${product.price}`}</h1>
          <button onClick={() => buyProduct(product.id, Number(product.price))}>
            Buy
          </button>
        </div>
      ))} */}
    </div>
  );
}

export default App;
