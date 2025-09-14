/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

interface CryptoData {
  symbol: string;
  name: string;
  price: number | null;
  convertedAmount: number | null;
  apiSource: string;
}

export default function Home() {
  const [inrAmount, setInrAmount] = useState<number>(1000);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: null,
      convertedAmount: null,
      apiSource: "",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: null,
      convertedAmount: null,
      apiSource: "",
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: null,
      convertedAmount: null,
      apiSource: "",
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: null,
      convertedAmount: null,
      apiSource: "",
    },
    {
      symbol: "USDT",
      name: "USDT-TRC20",
      price: null,
      convertedAmount: null,
      apiSource: "",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Binance API symbols (USDT pairs)
  const binanceSymbols = {
    BTC: "BTCUSDT",
    ETH: "ETHUSDT",
    DOGE: "DOGEUSDT",
    SOL: "SOLUSDT",

  };

  // CoinGecko API mapping
  const coinGeckoIds = {
    BTC: "bitcoin",
    ETH: "ethereum",
    DOGE: "dogecoin",
    SOL: "solana",
    USDT: "tether",
  };

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      setLoading(true);
      setError("");

      try {
        const binancePromises = Object.entries(binanceSymbols).map(
          async ([symbol, binanceSymbol]) => {
            try {
              const response = await fetch(
                `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`
              );
              if (response.ok) {
                const data = await response.json();
                return { symbol, price: parseFloat(data.price) };
              }
            } catch {
              return { symbol, price: null };
            }
          }
        );

        const binanceResults = await Promise.all(binancePromises);
        const binanceData: { [key: string]: number } = {};
        binanceResults.forEach((result) => {
          if (result && result.price !== null) {
            binanceData[result.symbol] = result.price;
          }
        });

        // If we got prices from Binance, convert to INR using USD/INR rate
        if (Object.keys(binanceData).length > 0) {
          try {
            // Get USD to INR rate
            const usdInrResponse = await fetch(
              "https://api.exchangerate-api.com/v4/latest/USD"
            );
            if (usdInrResponse.ok) {
              const usdInrData = await usdInrResponse.json();
              const usdToInrRate = usdInrData.rates.INR;

              const updatedCryptoData = cryptoData.map((crypto) => {
                let price = null;
                let convertedAmount = null;
                const apiSource = "Binance";

                if (crypto.symbol === "USDT") {
                  // USDT is approximately 1 USD, so use the USD/INR rate directly
                  price = usdToInrRate;
                  convertedAmount = inrAmount / price;
                } else {
                  const usdPrice = binanceData[crypto.symbol];
                  if (usdPrice) {
                    price = usdPrice * usdToInrRate;
                    convertedAmount = inrAmount / price;
                  }
                }

                return {
                  ...crypto,
                  price,
                  convertedAmount,
                  apiSource,
                };
              });

              setCryptoData(updatedCryptoData);
              setLoading(false);
              return;
            }
          } catch {
            console.log("USD/INR rate fetch failed, trying CoinGecko...");
          }
        }
      } catch {
        console.log("Binance API failed, trying CoinGecko...");
      }

      // Fallback to CoinGecko API
      try {
        const coinGeckoIdsList = Object.values(coinGeckoIds).join(",");
        const coinGeckoResponse = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsList}&vs_currencies=inr&include_24hr_change=true`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (coinGeckoResponse.ok) {
          const coinGeckoData = await coinGeckoResponse.json();

          const updatedCryptoData = cryptoData.map((crypto) => {
            const coinGeckoId =
              coinGeckoIds[crypto.symbol as keyof typeof coinGeckoIds];
            const price = coinGeckoData[coinGeckoId]?.inr || null;
            const convertedAmount = price ? inrAmount / price : null;

            return {
              ...crypto,
              price,
              convertedAmount,
              apiSource: "CoinGecko",
            };
          });

          setCryptoData(updatedCryptoData);
        } else {
          throw new Error("CoinGecko API failed");
        }
      } catch {
        console.error("All APIs failed");
        setError("Unable to fetch current rates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrices();
  }, [inrAmount]);

  const handleInrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInrAmount(value);
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCrypto(e.target.value);
  };

  const selectedCryptoData = cryptoData.find(
    (crypto) => crypto.symbol === selectedCrypto
  );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        INR to Cryptocurrency Converter
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="inrAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter INR Amount
            </label>
            <input
              type="number"
              id="inrAmount"
              value={inrAmount}
              onChange={handleInrChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount in INR"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label
              htmlFor="cryptoSelect"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Cryptocurrency
            </label>
            <select
              id="cryptoSelect"
              value={selectedCrypto}
              onChange={handleCryptoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cryptoData.map((crypto) => (
                <option key={crypto.symbol} value={crypto.symbol}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Conversion Result */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading conversion rates...</p>
          </div>
        ) : selectedCryptoData && selectedCryptoData.price ? (
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Conversion Result
            </h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ₹{inrAmount.toLocaleString("en-IN")} ={" "}
              {selectedCryptoData.convertedAmount?.toFixed(8)}{" "}
              {selectedCryptoData.symbol}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              1 {selectedCryptoData.symbol} = ₹
              {selectedCryptoData.price?.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500">
              Data source: {selectedCryptoData.apiSource}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
