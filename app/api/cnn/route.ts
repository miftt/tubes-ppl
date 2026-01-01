import { parseRSS, replaceQueryParams, search } from "@/lib/rss-utils";
import { NextResponse, NextRequest } from "next/server";
import { Item } from "rss-parser";
import { RSSItemWithImage, CNNNewsResponse } from "@/types/rss";

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

    const data = result.items.map((items: Item): RSSItemWithImage => {
      const itemWithImage = items as any;
      const image = replaceQueryParams(
        items?.enclosure?.url as string,
        "q",
        "100"
      );
      delete itemWithImage.pubDate;
      delete itemWithImage["content:encoded"];
      delete itemWithImage["content:encodedSnippet"];
      delete itemWithImage.content;
      delete itemWithImage.guid;
      itemWithImage.image = {
        small: items?.enclosure?.url,
        large: image,
      };
      delete itemWithImage.enclosure;
      return itemWithImage as RSSItemWithImage;
    });

    let responseData: CNNNewsResponse = {
      messages: "Result of all news in CNN News",
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items: { item: Item }) => result.push(items.item));
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

