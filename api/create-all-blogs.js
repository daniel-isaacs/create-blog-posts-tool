import fetch from 'node-fetch';

const decodeHtmlEntities = (text) => {
    if (!text) return text;
    
    return text
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&#x22;/g, '"')
        .replace(/&#34;/g, '"')
        .replace(/&quot;/g, '"')
        .replace(/&#x26;/g, '&')
        .replace(/&amp;/g, '&')
        .replace(/&#x3C;/g, '<')
        .replace(/&lt;/g, '<')
        .replace(/&#x3E;/g, '>')
        .replace(/&gt;/g, '>')
        .replace(/&#x2F;/g, '/')
        .replace(/&#47;/g, '/')
        .replace(/&#x5C;/g, '\\')
        .replace(/&#92;/g, '\\')
        .replace(/&#x60;/g, '`')
        .replace(/&#96;/g, '`')
        .replace(/&#x21;/g, '!')
        .replace(/&#33;/g, '!')
        .replace(/&#x3F;/g, '?')
        .replace(/&#63;/g, '?')
        .replace(/&#x3A;/g, ':')
        .replace(/&#58;/g, ':')
        .replace(/&#x3B;/g, ';')
        .replace(/&#59;/g, ';')
        .replace(/&#x2D;/g, '-')
        .replace(/&#45;/g, '-')
        .replace(/&#x2E;/g, '.')
        .replace(/&#46;/g, '.')
        .replace(/&#x28;/g, '(')
        .replace(/&#40;/g, '(')
        .replace(/&#x29;/g, ')')
        .replace(/&#41;/g, ')')
        .replace(/&#x5B;/g, '[')
        .replace(/&#91;/g, '[')
        .replace(/&#x5D;/g, ']')
        .replace(/&#93;/g, ']')
        .replace(/&#x7B;/g, '{')
        .replace(/&#123;/g, '{')
        .replace(/&#x7D;/g, '}')
        .replace(/&#125;/g, '}')
        .replace(/&#x20;/g, ' ')
        .replace(/&#32;/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#160;/g, ' ')
        .replace(/&#xA0;/g, ' ')
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
                // Call parse-url API using the current domain
                const parseResponse = await fetch(`${req.headers.origin || 'https://' + req.headers.host}/api/parse-url`, {
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
                
                if (!parsedData.title || !parsedData.author) {
                    errors.push({ url, error: 'Missing required title or author' });
                    continue;
                }

                const generateUUID = () => {
                    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };

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
                        SeoSettings: {
                            GraphType: "article"
                        }
                    }
                };

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
}