import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import mockData from "./data.json";

interface MessageProps {
  children: ReactNode;
}

interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: number | null;
  last_updated: string;
}

const Message: FC<MessageProps> = ({ children }) => {
  return <div className="text-center p-4">{children}</div>;
};

// api
const coinsCoingecko =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";
const globalCoingecko = "https://api.coingecko.com/api/v3/global";

const fetchCoins = async (): Promise<CryptoCoin[]> => {
  let res = await fetch(coinsCoingecko).then((res) => res.json());
  return res;
};

const fetchGlobal = async (): Promise<any> => {
  let res = await fetch(globalCoingecko).then((res) => res.json());
  return res;
};

const Home: FC = (): JSX.Element => {
  // const { data: coins, status: statusCoins } = useQuery({
  //   queryKey: ["coins"],
  //   queryFn: fetchCoins,
  // });
  // const { data: global, status: statusGlobal } = useQuery({
  //   queryKey: ["global"],
  //   queryFn: fetchGlobal,
  // });

  // if (statusCoins === "loading" || statusGlobal === "loading")
  //   return <Message>Loading...</Message>;
  // if (statusCoins === "error" || statusGlobal === "error")
  //   return <Message>Fetch error.</Message>;

  // const marketCap = Number(global.data?.total_market_cap?.usd).toLocaleString();
  // const marketCapTop100 = coins
  //   .map((coin) => Number(coin.market_cap))
  //   .reduce((acc: number, val: number) => {
  //     return acc + val;
  //   }, 0)
  //   .toLocaleString();

  const marketCapTop100 = mockData
    .map((coin) => Number(coin.market_cap))
    .reduce((acc: number, val: number) => {
      return acc + val;
    }, 0)
    .toLocaleString();

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col">
          <CardTitle className="font-bold">
            Top 100 cryptocurrencies by market cap
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-stretch gap-2">
          <div className="flex flex-col flex-1 rounded bg-gray-100 p-2">
            <span className="font-bold">Top 100 currencies market cap</span>
            <span>${marketCapTop100}</span>
          </div>

          {/* <div className="flex flex-col flex-1 rounded bg-gray-100 p-2">
            <span className="font-bold">Total market cap</span>
            <span>${marketCap}</span>
          </div> */}
        </CardContent>

        {/* list */}
        <CardContent>
          <ul className="flex flex-col gap-1">
            {mockData.map((coin: any) => (
              <li key={coin.id} className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-base">{coin.name}</span>
                  <span className="text-gray-600">({coin.symbol})</span>
                </div>
                <div>
                  <span>${Number(coin.market_cap).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
