import { FC, useEffect, useState } from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoricalColorSchemeId } from "./types";
import { CryptoCoin } from "./coin";

const coinsNumOptions = [
  { value: 10 },
  { value: 25 },
  { value: 50 },
  { value: 100 },
];

const themes: CategoricalColorSchemeId[] = [
  "nivo",
  "category10",
  "accent",
  "dark2",
  "paired",
  "pastel1",
  "pastel2",
  "set1",
  "set2",
  "set3",
  "tableau10",
];

const Home: FC = (): JSX.Element => {
  const [theme, setTheme] = useState<CategoricalColorSchemeId>("category10");
  const [coinsNum, setCoinsNum] = useState<number>(100);
  const [chartData, setChartData] = useState({});
  const [marketcap, setMarketcap] = useState<number>(0);
  // api
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [globalMarketcap, setGlobalMarketcap] = useState<number>(0);

  const format = (v: number) => {
    const percent = (v / marketcap) * 100;
    return Number(percent.toFixed(2)).toString() + "%";
  };

  const fetchCoins = async (): Promise<void> => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";
    try {
      let res = await fetch(url).then((res) => res.json());
      if (res) {
        setCoins(res);
      }
    } catch (error) {
      console.error(error);
      // @ts-ignore
      console.log("Coins:", error.message);
    }
  };

  const fetchGlobalMarketcap = async (): Promise<void> => {
    const url = "https://api.coingecko.com/api/v3/global";
    try {
      let res = await fetch(url).then((res) => res.json());
      if (res) {
        const usdMarketcap = res.data?.total_market_cap?.usd;
        setGlobalMarketcap(usdMarketcap);
      }
    } catch (error) {
      console.error(error);
      // @ts-ignore
      console.log("Global marketcap:", error.message);
    }
  };

  const fetchData = async (): Promise<void> => {
    await fetchCoins();
    await fetchGlobalMarketcap();
  };

  useEffect(() => {
    fetchData();
  }, [coinsNum]);

  useEffect(() => {
    if (!globalMarketcap) return;
    if (coins.length < 1) return;
    const length = coinsNum;
    const sliced = coins.slice(0, length);
    const mc = sliced.reduce((acc, coin) => acc + coin.market_cap, 0);
    const children = sliced.map((coin) => ({
      name: coin.name,
      children: [
        {
          name: coin.name,
          value: Number(coin.market_cap),
        },
      ],
    }));

    setMarketcap(mc);
    setChartData({
      name: `Top ${coinsNum} coins`,
      children: children,
    });
  }, [globalMarketcap, coins]);

  return (
    <div className="">
      <header className="flex items-center gap-6 h-[48px] px-[10px] overflow-x-auto whitespace-nowrap">
        <div className="flex flex-col leading-tight text-sm">
          <h1>
            Top crypto coins <br /> treemap chart
          </h1>
        </div>

        {/* themes */}
        <div className="flex flex-col leading-tight text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-none" variant="outline">
                <span className="text-gray-500">Theme:</span>&nbsp;
                {theme}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none">
              {themes.map((id) => (
                <DropdownMenuItem
                  key={id}
                  className="cursor-pointer hover:rounded-none"
                  onClick={() => setTheme(id)}
                >
                  {id}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* coins */}
        <div className="flex flex-col leading-tight text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-none" variant="outline">
                <span className="text-gray-500">Coins:</span>&nbsp;
                {coinsNum}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-none">
              {coinsNumOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="cursor-pointer hover:rounded-none"
                  onClick={() => setCoinsNum(option.value)}
                >
                  {option.value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col leading-tight text-sm">
          <span>Top {coinsNum} coins market cap:</span>
          <span>${marketcap.toLocaleString()}</span>
        </div>

        <div className="flex flex-col leading-tight text-sm">
          <span>Total market cap:</span>
          <span>${globalMarketcap.toLocaleString()}</span>
        </div>

        <div className="flex flex-col leading-tight text-sm">
          <span>CoinGecko demo API:</span>
          <span>30 calls/min</span>
        </div>
      </header>
      <hr />

      {/* h = 100vh - (header + margin + hr) */}
      <div className="flexw-full h-[calc(100vh-69px)] overflow-hidden m-[10px]">
        <ResponsiveTreeMap
          data={chartData}
          identity="name"
          value="value"
          valueFormat={format}
          // label
          labelSkipSize={26}
          labelTextColor="black"
          // parent label
          parentLabelSize={14}
          parentLabelTextColor="black"
          parentLabelPadding={4}
          // styles
          nodeOpacity={1}
          colors={{ scheme: theme }}
        />
      </div>
    </div>
  );
};

export default Home;
