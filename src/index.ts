#!/usr/bin/env node

import 'dotenv/config';
import { VideoManagement } from './functions/videos.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Environment variable validation
if (!process.env.YOUTUBE_API_KEY) {
  console.error('Error: YOUTUBE_API_KEY environment variable is not set.');
  process.exit(1);
}

// Default caption language setting
const defaultTranscriptLang = process.env.YOUTUBE_TRANSCRIPT_LANG || 'en';

interface VideoDetailsParams {
    videoIds: string[];
}

interface SingleVideoParams {
    videoId: string;
}

interface TranscriptParams {
    videoIds: string[];
}

interface SearchParams {
    query: string;
    maxResults?: number;
}

interface RelatedVideosParams {
    videoId: string;
    maxResults?: number;
}

interface ChannelParams {
    channelId: string;
    maxResults?: number;
}

interface TrendingParams {
    regionCode?: string;
    categoryId?: string;
    maxResults?: number;
}

interface CompareVideosParams {
    videoIds: string[];
}

async function main() {
    const videoManager = new VideoManagement();
    
    // Create MCP server
    const server = new McpServer({
        name: "YouTube",
        version: "1.0.0"
    });

    // Video details retrieval tool
    server.tool(
        "getVideoDetails",
        "Retrieves detailed information for a list of videos by their IDs. Returns comprehensive data including video metadata, statistics, and content details. Use this when you need complete information about specific videos.",
        { videoIds: z.array(z.string()) },
        async ({ videoIds }: VideoDetailsParams) => {
            try {
                const videoDetailsPromises = videoIds.map(videoId => 
                    videoManager.getVideo({
                        videoId,
                        parts: ["snippet", "statistics", "contentDetails"]
                    })
                );
                
                const videoDetailsList = await Promise.all(videoDetailsPromises);
                
                return {
                    content: [{ type: "text", text: JSON.stringify(videoDetailsList, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Video search tool
    server.tool(
        "searchVideos",
        "Searches for videos based on a query string. Returns a list of videos matching the search criteria, including titles, descriptions, and metadata. Use this when you need to find videos related to specific topics or keywords.",
        { 
            query: z.string(),
            maxResults: z.number().optional()
        },
        async ({ query, maxResults }: SearchParams) => {
            try {
                const searchResults = await videoManager.searchVideos({
                    query,
                    maxResults
                });
                return {
                    content: [{ type: "text", text: JSON.stringify(searchResults, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Video transcript retrieval tool
    server.tool(
        "getTranscript",
        "Retrieves transcripts for one or more videos. Returns the text content of the videos' captions, useful for accessibility and content analysis. Use this when you need the spoken content of videos. The function can process multiple videos in a single request.",
        { videoIds: z.array(z.string()) },
        async ({ videoIds }: TranscriptParams) => {
            try {
                const transcriptPromises = videoIds.map(videoId => 
                    videoManager.getTranscript(videoId)
                );
                
                const transcripts = await Promise.all(transcriptPromises);
                
                return {
                    content: [{ type: "text", text: JSON.stringify(transcripts, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Related videos retrieval tool
    server.tool(
        "getRelatedVideos",
        "Retrieves related videos for a specific video. Returns a list of videos that are similar or related to the specified video, based on YouTube's recommendation algorithm. Use this when you want to discover content similar to a particular video.",
        { 
            videoId: z.string(),
            maxResults: z.number().optional()
        },
        async ({ videoId, maxResults }: RelatedVideosParams) => {
            try {
                const relatedVideos = await videoManager.getRelatedVideos(videoId, maxResults);
                return {
                    content: [{ type: "text", text: JSON.stringify(relatedVideos, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Channel statistics retrieval tool
    server.tool(
        "getChannelStatistics",
        "Retrieves statistics for a specific channel. Returns detailed metrics including subscriber count, view count, and video count. Use this when you need to analyze the performance and reach of a YouTube channel.",
        { channelId: z.string() },
        async ({ channelId }: ChannelParams) => {
            try {
                const statistics = await videoManager.getChannelStatistics(channelId);
                return {
                    content: [{ type: "text", text: JSON.stringify(statistics, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Channel top videos retrieval tool
    server.tool(
        "getChannelTopVideos",
        "Retrieves the top videos from a specific channel. Returns a list of the most viewed or popular videos from the channel, based on view count. Use this when you want to identify the most successful content from a channel.",
        { 
            channelId: z.string(),
            maxResults: z.number().optional()
        },
        async ({ channelId, maxResults }: ChannelParams) => {
            try {
                const topVideos = await videoManager.getChannelTopVideos({ channelId, maxResults });
                return {
                    content: [{ type: "text", text: JSON.stringify(topVideos, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Video engagement ratio calculation tool
    server.tool(
        "getVideoEngagementRatio",
        "Calculates the engagement ratio for a specific video. Returns metrics such as view count, like count, comment count, and the calculated engagement ratio. Use this when you want to measure the audience interaction with a video.",
        { videoId: z.string() },
        async ({ videoId }: SingleVideoParams) => {
            try {
                const engagementRatio = await videoManager.getVideoEngagementRatio(videoId);
                return {
                    content: [{ type: "text", text: JSON.stringify(engagementRatio, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Trending videos retrieval tool
    server.tool(
        "getTrendingVideos",
        "Retrieves trending videos based on region and category. Returns a list of videos that are currently popular in the specified region and category. Use this when you want to discover what's trending in specific areas or categories. Available category IDs: 1 (Film & Animation), 2 (Autos & Vehicles), 10 (Music), 15 (Pets & Animals), 17 (Sports), 18 (Short Movies), 19 (Travel & Events), 20 (Gaming), 21 (Videoblogging), 22 (People & Blogs), 23 (Comedy), 24 (Entertainment), 25 (News & Politics), 26 (Howto & Style), 27 (Education), 28 (Science & Technology), 29 (Nonprofits & Activism), 30 (Movies), 31 (Anime/Animation), 32 (Action/Adventure), 33 (Classics), 34 (Comedy), 35 (Documentary), 36 (Drama), 37 (Family), 38 (Foreign), 39 (Horror), 40 (Sci-Fi/Fantasy), 41 (Thriller), 42 (Shorts), 43 (Shows), 44 (Trailers).",
        { 
            regionCode: z.string().optional(),
            categoryId: z.string().optional(),
            maxResults: z.number().optional()
        },
        async ({ regionCode, categoryId, maxResults }: TrendingParams) => {
            try {
                const trendingVideos = await videoManager.getTrendingVideos({ regionCode, categoryId, maxResults });
                return {
                    content: [{ type: "text", text: JSON.stringify(trendingVideos, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Video comparison tool
    server.tool(
        "compareVideos",
        "Compares multiple videos based on their statistics. Returns a comparison of view counts, like counts, comment counts, and other metrics for the specified videos. Use this when you want to analyze the performance of multiple videos side by side.",
        { videoIds: z.array(z.string()) },
        async ({ videoIds }: CompareVideosParams) => {
            try {
                const comparison = await videoManager.compareVideos({ videoIds });
                return {
                    content: [{ type: "text", text: JSON.stringify(comparison, null, 2) }]
                };
            } catch (error: any) {
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify({
                            error: error.message,
                            details: error.response?.data
                        }, null, 2) 
                    }]
                };
            }
        }
    );

    // Start message exchange through stdin/stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('YouTube MCP server has started.');
}

main().catch((err) => {
    console.error('Error occurred during server execution:', err);
    process.exit(1);
}); 