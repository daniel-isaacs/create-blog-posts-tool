require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const { DOMParser } = require('xmldom');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Function to decode HTML entities - moved to global scope
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
        // Handle any remaining numeric entities
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        // Handle any remaining hex entities
        .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
};

// // Serve the HTML file from the create-content folder
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'create-content', 'create-content.html'));
// });

// Serve the HTML file from the index.html file in the root directory
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Proxy endpoint for parsing URL content
app.post('/api/parse-url', async (req, res) => {
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
                    // Remove unwanted elements
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<!--[\s\S]*?-->/g, '')
                    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
                    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
                    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
                    // Remove social sharing, ads, and other non-content elements
                    .replace(/<div[^>]*class="[^"]*(?:social|share|ad|advertisement|sidebar|related|author-bio|tags|categories)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                    // Remove form elements
                    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
                    // Remove button elements that aren't part of content
                    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
                    // Clean up common non-content classes
                    .replace(/<div[^>]*class="[^"]*(?:meta|breadcrumb|pagination|newsletter|cta)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                    // Clean up excessive whitespace but preserve paragraph breaks
                    .replace(/\s+/g, ' ')
                    .replace(/>\s+</g, '><')
                    .trim();
                
                // If content is still very long, try to focus on main content paragraphs
                if (content.length > 10000) {
                    // Extract main paragraphs and headings
                    const paragraphs = content.match(/<(?:p|h[1-6]|ul|ol|li|blockquote)[^>]*>[\s\S]*?<\/(?:p|h[1-6]|ul|ol|li|blockquote)>/gi);
                    if (paragraphs && paragraphs.length > 0) {
                        content = paragraphs.join('\n');
                    }
                }
                
                return content;
            }
            
            // Fallback: look for div with class "blog-post__main-content"
            const fallbackDivMatch = html.match(/<div[^>]*class="[^"]*blog-post__main-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
            if (fallbackDivMatch) {
                let content = fallbackDivMatch[1];
                // Apply same cleaning as above
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
            
            // Fallback: look for generic <article> tag
            const fallbackArticleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
            if (fallbackArticleMatch) {
                let content = fallbackArticleMatch[1];
                // Apply same cleaning as above
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
            
            // Additional fallback selectors
            const fallbackSelectors = [
                /<div[^>]*class="[^"]*(?:article-content|post-content|entry-content|content-body|main-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
                /<main[^>]*>([\s\S]*?)<\/main>/i,
                /<section[^>]*class="[^"]*content[^"]*"[^>]*>([\sS]*?)<\/section>/i
            ];
            
            for (const selector of fallbackSelectors) {
                const match = html.match(selector);
                if (match) {
                    let content = match[1];
                    // Apply same cleaning as above
                    content = content
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<!--[\s\S]*?-->/g, '')
                        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
                        .replace(/<footer[^>]*>[\sS]*?<\/footer>/gi, '')
                        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
                        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
                        .replace(/<div[^>]*class="[^"]*(?:social|share|ad|advertisement|sidebar|related)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
                        .replace(/\s+/g, ' ')
                        .replace(/>\s+</g, '><')
                        .trim();
                    return content;
                }
            }
            
            return null;
        };

        // Extract all the data according to specifications
        const displayName = decodeHtmlEntities(extractDisplayName(html));
        const heading = decodeHtmlEntities(extractHeading(html));
        const author = decodeHtmlEntities(extractAuthor(html));
        const blogPostBody = extractBlogPostBody(html);
        // const promoImage = extractPromoImage(html);
        const promoImage = '';

        const parsedData = {
            displayName: displayName,
            title: heading,
            description: '', // ArticleSubHeading - leave blank as requested
            author: author,
            content: blogPostBody,
            image: promoImage
        };

        // console.log('Parsed data:', parsedData); // Debug log

        res.json(parsedData);
        
    } catch (error) {
        console.error('Parsing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for getting access token
app.post('/api/token', async (req, res) => {
    try {
        const { clientId, clientSecret, cmsUrl } = req.body;
        
        // Encode credentials for basic auth
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        const response = await fetch(`${cmsUrl}/_cms/preview2/oauth/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for creating content
app.post('/api/content', async (req, res) => {
    try {
        const { accessToken, cmsUrl, blogContent } = req.body;
        
        const response = await fetch(`${cmsUrl}/_cms/preview2/content`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(blogContent)
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json(data);
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get recent blog post URLs from RSS feed
app.post('/api/get-recent-posts', async (req, res) => {
    try {
        const { rssUrl } = req.body;
        console.log('Fetching recent posts from RSS URL:', rssUrl);
        if (!rssUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Fetch the RSS feed
        const response = await fetch(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch RSS feed' });
        }

        const rssXml = await response.text();
        // console.log('\n=== RSS FEED CONTENT ===');
        // console.log(rssXml.substring(0, 1000) + '...');
        // console.log('=== END RSS SAMPLE ===\n');
        
        // Parse RSS XML using DOM parser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssXml, 'text/xml');
        
        // Check for parsing errors
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
            console.error('XML parsing error:', parseError[0].textContent);
            return res.status(500).json({ error: 'Failed to parse RSS feed XML' });
        }
        
        const blogPostLinks = [];
        
        // Get all entry elements
        const entries = xmlDoc.getElementsByTagName('entry');
        console.log(`Found ${entries.length} entries in RSS feed`);
        
        var i = 0;
        while( i < entries.length && blogPostLinks.length < 5) {
            
            const entry = entries[i];
            i++;
            
            // Get the id element within this entry
            const idElements = entry.getElementsByTagName('id');
            if (idElements.length > 0) {
                const url = idElements[0].textContent.trim();
                
                let slug = url => new URL(url).pathname.match(/[^\/]+/g)
                const firstSegmentLength = slug(url)[0].length; // check for locale slug
                
                // Ensure it's a valid blog post URL
                if (url.includes('/insights/blog/') && 
                    !url.includes('/category/') && 
                    !url.includes('/tag/') &&
                    !url.includes('?') &&
                    !url.includes('?') &&
                    !url.endsWith('/insights/blog/') &&
                    !url.endsWith('/insights/blog') &&
                    firstSegmentLength !== 2) {
                    
                    // console.log(`Entry ${i + 1} URL:`, url);

                    if (!blogPostLinks.includes(url)) {
                        blogPostLinks.push(url);
                        // console.log('Added RSS blog post URL:', url);
                        
                        // Also log the title for debugging
                        const titleElements = entry.getElementsByTagName('title');
                        // if (titleElements.length > 0) {
                        //     console.log('  Title:', titleElements[0].textContent);
                        // }
                    }
                }
            }
        }

        // for (let i = 0; i < Math.min(entries.length, 5); i++) {
        //     const entry = entries[i];
            
        //     // Get the id element within this entry
        //     const idElements = entry.getElementsByTagName('id');
        //     if (idElements.length > 0) {
        //         const url = idElements[0].textContent.trim();
                
        //         // Ensure it's a valid blog post URL
        //         if (url.includes('/insights/blog/') && 
        //             !url.includes('/category/') && 
        //             !url.includes('/tag/') &&
        //             !url.includes('?') &&
        //             !url.endsWith('/insights/blog/') &&
        //             !url.endsWith('/insights/blog')) {
                    
        //             console.log(`Entry ${i + 1} URL:`, url);

        //             if (!blogPostLinks.includes(url)) {
        //                 blogPostLinks.push(url);
        //                 console.log('Added RSS blog post URL:', url);
                        
        //                 // Also log the title for debugging
        //                 const titleElements = entry.getElementsByTagName('title');
        //                 if (titleElements.length > 0) {
        //                     console.log('  Title:', titleElements[0].textContent);
        //                 }
        //             }
        //         }
        //     }
        // }
        
        console.log('Final recent blog posts from RSS:', blogPostLinks);
        
        res.json({ urls: blogPostLinks });
        
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to create multiple blog posts from URLs
app.post('/api/create-all-blogs', async (req, res) => {
    try {
        const { accessToken, cmsUrl, containerUuid, urls } = req.body;
        
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: 'URLs array is required' });
        }

        const results = [];
        const errors = [];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            console.log(`\n=== Processing blog ${i + 1}/${urls.length}: ${url} ===`);
            
            try {
                // First, parse the URL content
                // Get the base URL more reliably
                const baseUrl = process.env.VERCEL_URL 
                  ? `https://${process.env.VERCEL_URL}` 
                  : req.headers.origin || `https://${req.headers.host}`;

                const parseResponse = await fetch(`${baseUrl}/api/parse-url`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                });

                if (!parseResponse.ok) {
                    throw new Error(`Failed to parse URL: ${parseResponse.status}`);
                }

                const parsedData = await parseResponse.json();
                
                // Skip if we don't have essential data
                if (!parsedData.title || !parsedData.author) {
                    errors.push({ url, error: 'Missing required title or author' });
                    continue;
                }

                // Generate a random UUID for the content
                const generateUUID = () => {
                    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };

                // Create blog content object
                const blogContent = {
                    key: generateUUID(),
                    contentType: "BlogPostPage",
                    locale: "en",
                    container: containerUuid,
                    status: "published",
                    displayName: decodeHtmlEntities(parsedData.title),
                    properties: {
                        Heading: decodeHtmlEntities(parsedData.title),
                        ArticleSubHeading: decodeHtmlEntities(parsedData.description) || '',
                        BlogPostBody: parsedData.content || '',
                        ArticleAuthor: decodeHtmlEntities(parsedData.author),
                        // BlogPostPromoImage: parsedData.image || '',
                        SeoSettings: {
                            GraphType: "article"
                        }
                    }
                };

                // Create the blog post in CMS
                const createResponse = await fetch(`${cmsUrl}/_cms/preview2/content`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(blogContent)
                });

                if (createResponse.ok) {
                    const result = await createResponse.json();
                    results.push({
                        url,
                        title: parsedData.title,
                        success: true,
                        contentKey: result.key || blogContent.key
                    });
                    console.log(`✓ Successfully created: ${parsedData.title}`);
                } else {
                    const errorData = await createResponse.json();
                    errors.push({
                        url,
                        title: parsedData.title,
                        error: `Failed to create: ${createResponse.status} - ${errorData.error || 'Unknown error'}`
                    });
                    console.log(`✗ Failed to create: ${parsedData.title}`);
                }

                // Add a small delay between requests to be nice to the server
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                errors.push({ url, error: error.message });
                console.log(`✗ Error processing ${url}: ${error.message}`);
            }
        }

        console.log(`\n=== Bulk Creation Complete ===`);
        console.log(`Successful: ${results.length}`);
        console.log(`Errors: ${errors.length}`);

        res.json({
            success: true,
            results,
            errors,
            summary: {
                total: urls.length,
                successful: results.length,
                failed: errors.length
            }
        });

    } catch (error) {
        console.error('Error in bulk blog creation:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add endpoint to get configuration
app.get('/api/config', (req, res) => {
    res.json({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        cmsUrl: process.env.CMS_URL
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Open your browser to http://localhost:${port} to use the blog creator`);
});