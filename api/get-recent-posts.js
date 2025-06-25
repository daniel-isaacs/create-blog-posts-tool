import fetch from 'node-fetch';
import { DOMParser } from 'xmldom';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { rssUrl } = req.body;
        console.log('Fetching recent posts from RSS URL:', rssUrl);
        if (!rssUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await fetch(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch RSS feed' });
        }

        const rssXml = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssXml, 'text/xml');
        
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
            console.error('XML parsing error:', parseError[0].textContent);
            return res.status(500).json({ error: 'Failed to parse RSS feed XML' });
        }
        
        const blogPostLinks = [];
        const entries = xmlDoc.getElementsByTagName('entry');
        console.log(`Found ${entries.length} entries in RSS feed`);
        
        var i = 0;
        while( i < entries.length && blogPostLinks.length < 5) {
            const entry = entries[i];
            i++;
            
            const idElements = entry.getElementsByTagName('id');
            if (idElements.length > 0) {
                const url = idElements[0].textContent.trim();
                
                let slug = url => new URL(url).pathname.match(/[^\/]+/g)
                const firstSegmentLength = slug(url)[0].length;
                
                if (url.includes('/insights/blog/') && 
                    !url.includes('/category/') && 
                    !url.includes('/tag/') &&
                    !url.includes('?') &&
                    !url.endsWith('/insights/blog/') &&
                    !url.endsWith('/insights/blog') &&
                    firstSegmentLength !== 2) {
                    
                    if (!blogPostLinks.includes(url)) {
                        blogPostLinks.push(url);
                    }
                }
            }
        }
        
        console.log('Final recent blog posts from RSS:', blogPostLinks);
        res.json({ urls: blogPostLinks });
        
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).json({ error: error.message });
    }
}