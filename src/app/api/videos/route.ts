import { GetVideosForPanel } from "@/utils/videos";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const videos = await GetVideosForPanel();
      return NextResponse.json(videos);
}