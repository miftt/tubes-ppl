import { parseRSS, replaceQueryParams, search } from "@/lib/rss-utils";
import { NextResponse, NextRequest } from "next/server";
import { Item } from "rss-parser";

type ResponseData = {
  message?: string;
  messages?: string;
  total?: number;
  data?: ({
    [key: string]: any;
  } & Item)[];
  "CNN News"?: {
    all: string;
    type: string;
    listType: string[];
  };
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.get("search");
    const fetchParam = url.searchParams.get("fetch");
    
    // If no search param and no fetch param, return endpoint information
    if (!searchParams && !fetchParam) {
      return NextResponse.json({
        data: {
          "CNN News": {
            all: "/api/cnn",
            type: "/api/cnn/:type",
            listType: [
              "nasional",
              "internasional",
              "ekonomi",
              "olahraga",
              "teknologi",
              "hiburan",
              "gaya-hidup",
            ],
          },
        },
      });
    }

    const CNN_NEWS_RSS = "https://www.cnnindonesia.com/rss";
    const result = await parseRSS({
      url: CNN_NEWS_RSS,
    });

    const data = result.items.map((items) => {
      const image = replaceQueryParams(
        items?.enclosure?.url as string,
        "q",
        "100"
      );
      delete items.pubDate;
      delete items["content:encoded"];
      delete items["content:encodedSnippet"];
      delete items.content;
      delete items.guid;
      items.image = {
        small: items?.enclosure?.url,
        large: image,
      };
      delete items.enclosure;
      return items;
    });

    let responseData: ResponseData = {
      messages: "Result of all news in CNN News",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items) => result.push(items.item));
      responseData = {
        messages: `Result of all news in CNN News with title search: ${searchParams}`,
        total: searchData.length,
        data: result,
      };
    }

    return NextResponse.json(responseData);
  } catch (e) {
    return NextResponse.json(
      {
        message: "Something error",
      },
      { status: 400 }
    );
  }
}

