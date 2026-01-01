import { Item } from "rss-parser";
import { parseRSS, replaceQueryParams, search } from "@/lib/rss-utils";
import { NextResponse, NextRequest } from "next/server";
import { RSSItemWithImage } from "@/types/rss";

type ResponseData = {
  message: string;
  total?: number;
  data?: RSSItemWithImage[];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const CNN_NEWS_RSS = `https://www.cnnindonesia.com/{type}/rss`;

    const url = new URL(request.url);
    const searchParams = url.searchParams.get("search");
    const result = await parseRSS({
      url: CNN_NEWS_RSS.replace("{type}", type),
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

    let responseData: ResponseData = {
      message: `Result of type ${type} news in CNN News`,
      total: data.length,
      data,
    };

    if (searchParams) {
      const searchData = search(data, searchParams);
      let result: Item[] = [];
      searchData.map((items: { item: Item }) => result.push(items.item));
      responseData = {
        message: `Result of type ${type} news in CNN News with title search: ${searchParams}`,
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

