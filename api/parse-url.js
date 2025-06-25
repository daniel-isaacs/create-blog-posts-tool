import fetch from 'node-fetch';

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
    if (!text) return text;
    
    return text
        .replace(/&#x27;/g, "'")        // Single quote
        .replace(/&#39;/g, "'")         // Single quote
        .replace(/&#x22;/g, '"')        // Double quote
        .replace(/&#34;/g, '"')         // Double quote
        .replace(/&quot;/g, '"')        // Double quote
        .replace(/&#x26;/g, '&')        // Ampersand
        .replace(/&amp;/g, '&')         // Ampersand
        .replace(/&#x3C;/g, '<')        // Less than
        .replace(/&lt;/g, '<')          // Less than
        .replace(/&#x3E;/g, '>')        // Greater than
        .replace(/&gt;/g, '>')          // Greater than
        .replace(/&#x2F;/g, '/')        // Forward slash
        .replace(/&#47;/g, '/')         // Forward slash
        .replace(/&#x5C;/g, '\\')       // Backslash
        .replace(/&#92;/g, '\\')        // Backslash
        .replace(/&#x60;/g, '`')        // Backtick
        .replace(/&#96;/g, '`')         // Backtick
        .replace(/&#x21;/g, '!')        // Exclamation mark
        .replace(/&#33;/g, '!')         // Exclamation mark
        .replace(/&#x3F;/g, '?')        // Question mark
        .replace(/&#63;/g, '?')         // Question mark
        .replace(/&#x3A;/g, ':')        // Colon
        .replace(/&#58;/g, ':')         // Colon
        .replace(/&#x3B;/g, ';')        // Semicolon
        .replace(/&#59;/g, ';')         // Semicolon
        .replace(/&#x2D;/g, '-')        // Hyphen/dash
        .replace(/&#45;/g, '-')         // Hyphen/dash
        .replace(/&#x2E;/g, '.')        // Period
        .replace(/&#46;/g, '.')         // Period
        .replace(/&#x28;/g, '(')        // Left parenthesis
        .replace(/&#40;/g, '(')         // Left parenthesis
        .replace(/&#x29;/g, ')')        // Right parenthesis
        .replace(/&#41;/g, ')')         // Right parenthesis
        .replace(/&#x5B;/g, '[')        // Left square bracket
        .replace(/&#91;/g, '[')         // Left square bracket
        .replace(/&#x5D;/g, ']')        // Right square bracket
        .replace(/&#93;/g, ']')         // Right square bracket
        .replace(/&#x7B;/g, '{')        // Left curly brace
        .replace(/&#123;/g, '{')        // Left curly brace
        .replace(/&#x7D;/g, '}')        // Right curly brace
        .replace(/&#125;/g, '}')        // Right curly brace
        .replace(/&#x20;/g, ' ')        // Space
        .replace(/&#32;/g, ' ')         // Space
        .replace(/&nbsp;/g, ' ')        // Non-breaking space
        .replace(/&#160;/g, ' ')        // Non-breaking space
        .replace(/&#xA0;/g, ' ')        // Non-breaking space
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Fetch the webpage
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch webpage' });
        }

        const html = await response.text();
        
        // Extract displayName from og:title meta tag
        const extractDisplayName = (html) => {
            const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
            return ogTitleMatch ? ogTitleMatch[1] : null;
        };

        // Extract Heading from first <h1> on the page
        const extractHeading = (html) => {
            const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
            return h1Match ? h1Match[1] : null;
        };

        // Extract ArticleAuthor from article:author meta tag
        const extractAuthor = (html) => {
            const authorMatch = html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']*)["']/i);
            return authorMatch ? authorMatch[1] : null;
        };

        // Extract BlogPostBody from everything in the "blog-post__main-content" class
        const extractBlogPostBody = (html) => {
            // Look for article with class "blog-post__main-content"
            const articleMatch = html.match(/<article[^>]*class="[^"]*blog-post__main-content[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
            
            if (articleMatch) {
                let content = articleMatch[1];
                
                // Clean up the content while preserving structure
                content = content
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<!--[\s\S]*?-->/g, '')
                    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
                    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
                    .replace(/<div[^>]*class="[^"]*(?:social|share|ad|advertisement|sidebar|related|author-bio|tags|categories)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
                    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
                    .replace(/<div[^>]*class="[^"]*(?:meta|breadcrumb|pagination|newsletter|cta)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                    .replace(/\s+/g, ' ')
                    .replace(/>\s+</g, '><')
                    .trim();
                
                if (content.length > 10000) {
                    const paragraphs = content.match(/<(?:p|h[1-6]|ul|ol|li|blockquote)[^>]*>[\s\S]*?<\/(?:p|h[1-6]|ul|ol|li|blockquote)>/gi);
                    if (paragraphs && paragraphs.length > 0) {
                        content = paragraphs.join('\n');
                    }
                }
                
                return content;
            }
            
            // Fallback implementations (copy the rest from your server.js)
            const fallbackDivMatch = html.match(/<div[^>]*class="[^"]*blog-post__main-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
            if (fallbackDivMatch) {
                let content = fallbackDivMatch[1];
                content = content
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<!--[\s\S]*?-->/g, '')
                    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
                    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
                    .replace(/<div[^>]*class="[^"]*(?:social|share|ad|advertisement|sidebar|related)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                    .replace(/\s+/g, ' ')
                    .replace(/>\s+</g, '><')
                    .trim();
                return content;
            }
            
            return null;
        };

        // Extract all the data according to specifications
        const displayName = decodeHtmlEntities(extractDisplayName(html));
        const heading = decodeHtmlEntities(extractHeading(html));
        const author = decodeHtmlEntities(extractAuthor(html));
        const blogPostBody = extractBlogPostBody(html);
        const promoImage = '';

        const parsedData = {
            displayName: displayName,
            title: heading,
            description: '',
            author: author,
            content: blogPostBody,
            image: promoImage
        };

        res.json(parsedData);
        
    } catch (error) {
        console.error('Parsing error:', error);
        res.status(500).json({ error: error.message });
    }
}