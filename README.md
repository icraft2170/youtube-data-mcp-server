[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/icraft2170-youtube-data-mcp-server-badge.png)](https://mseep.ai/app/icraft2170-youtube-data-mcp-server)

# YouTube MCP Server
[![smithery badge](https://smithery.ai/badge/@icraft2170/youtube-data-mcp-server)](https://smithery.ai/server/@icraft2170/youtube-data-mcp-server)

A Model Context Protocol (MCP) server implementation utilizing the YouTube Data API. It allows AI language models to interact with YouTube content through a standardized interface.

## Key Features

### Video Information
* Retrieve detailed video information (title, description, duration, statistics)
* Search for videos by keywords
* Get related videos based on a specific video
* Calculate and analyze video engagement ratios

### Transcript/Caption Management
* Retrieve video captions with multi-language support
* Specify language preferences for transcripts
* Access time-stamped captions for precise content reference

### Channel Analysis
* View detailed channel statistics (subscribers, views, video count)
* Get top-performing videos from a channel
* Analyze channel growth and engagement metrics

### Trend Analysis
* View trending videos by region and category
* Compare performance metrics across multiple videos
* Discover popular content in specific categories

## Available Tools

The server provides the following MCP tools:

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `getVideoDetails` | Get detailed information about multiple YouTube videos including metadata, statistics, and content details | `videoIds` (array) |
| `searchVideos` | Search for videos based on a query string | `query`, `maxResults` (optional) |
| `getTranscripts` | Retrieve transcripts for multiple videos | `videoIds` (array), `lang` (optional) |
| `getRelatedVideos` | Get videos related to a specific video based on YouTube's recommendation algorithm | `videoId`, `maxResults` (optional) |
| `getChannelStatistics` | Retrieve detailed metrics for multiple channels including subscriber count, view count, and video count | `channelIds` (array) |
| `getChannelTopVideos` | Get the most viewed videos from a specific channel | `channelId`, `maxResults` (optional) |
| `getVideoEngagementRatio` | Calculate engagement metrics for multiple videos (views, likes, comments, and engagement ratio) | `videoIds` (array) |
| `getTrendingVideos` | Get currently popular videos by region and category | `regionCode` (optional), `categoryId` (optional), `maxResults` (optional) |
| `compareVideos` | Compare statistics across multiple videos | `videoIds` (array) |

## Installation

### Automatic Installation via Smithery

Automatically install YouTube MCP Server for Claude Desktop via [Smithery](https://smithery.ai/server/@icraft2170/youtube-data-mcp-server):

```bash
npx -y @smithery/cli install @icraft2170/youtube-data-mcp-server --client claude
```

### Manual Installation
```bash
# Install from npm
npm install youtube-data-mcp-server

# Or clone repository
git clone https://github.com/icraft2170/youtube-data-mcp-server.git
cd youtube-data-mcp-server
npm install
```

## Environment Configuration
Set the following environment variables:
* `YOUTUBE_API_KEY`: YouTube Data API key (required)
* `YOUTUBE_TRANSCRIPT_LANG`: Default caption language (optional, default: 'ko')

## MCP Client Configuration
Add the following to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "youtube-data-mcp-server"],
      "env": {
        "YOUTUBE_API_KEY": "YOUR_API_KEY_HERE",
        "YOUTUBE_TRANSCRIPT_LANG": "ko"
      }
    }
  }
}
```

## YouTube API Setup
1. Access Google Cloud Console
2. Create a new project or select an existing one
3. Enable YouTube Data API v3
4. Create API credentials (API key)
5. Use the generated API key in your environment configuration

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build
```

## Network Configuration

The server exposes the following ports for communication:
- HTTP: 3000
- gRPC: 3001

## System Requirements
- Node.js 18.0.0 or higher

## Security Considerations
- Always keep your API key secure and never commit it to version control systems
- Manage your API key through environment variables or configuration files
- Set usage limits for your API key to prevent unauthorized use

## License
This project is licensed under the MIT License. See the LICENSE file for details. 
