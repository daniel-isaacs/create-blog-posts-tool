<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimizely Blog Post Creator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], input[type="url"], textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        textarea {
            height: 200px;
            resize: vertical;
        }
        button {
            background-color: #007cba;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
        }
        button:hover {
            background-color: #005a87;
        }
        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .status {
            margin-top: 20px;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .token-section {
            display: none; /* Hide the token section */
            border: 1px solid #ddd;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .content-section {
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 4px;
        }
        .readonly {
            background-color: #f5f5f5;
            color: #666;
        }
        
        #createAllBtn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        
        #createAllBtn:disabled {
            background-color: #6c757d !important;
            cursor: not-allowed;
        }
        
        #createAllBtn:hover:not(:disabled) {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Optimizely Blog Post Creator</h1>
        
        <!-- Token Section - Hidden since it's automatic now -->
        <div class="token-section">
            <h2>Step 1: Get Access Token</h2>
            <div class="form-group">
                <label for="cmsUrl">CMS URL:</label>
                <input type="url" id="cmsUrl" value="" readonly class="readonly">
            </div>
            <div class="form-group">
                <label for="clientId">Client ID:</label>
                <input type="text" id="clientId" value="" readonly class="readonly">
            </div>
            <div class="form-group">
                <label for="clientSecret">Client Secret:</label>
                <input type="text" id="clientSecret" value="" readonly class="readonly">
            </div>
            <button id="getTokenBtn" onclick="getAccessToken()">Get Access Token</button>
            <div class="form-group" style="margin-top: 15px;">
                <label for="accessToken">Access Token:</label>
                <input type="text" id="accessToken" placeholder="Token will appear here..." readonly>
            </div>
        </div>

        <!-- Content Creation Section -->
        <div class="content-section">
            <h2>Create Blog Post</h2>
            <div class="form-group">
                <label for="containerUuid">Container UUID:</label>
                <input type="text" id="containerUuid" placeholder="Parent page content ID" value="">
            </div>
            <div class="form-group">
                <label for="blogUrl">URLs (optional - auto-fill from URL):</label>
                <input type="url" id="blogUrl" placeholder="Enter blog post URL to auto-populate fields" oninput="handleUrlInput()">
                <input type="url" id="rssUrl" placeholder="Enter RSS feed URL to get recent blog posts" oninput="handleUrlInput()">
                <button type="button" onclick="parseUrl()" id="parseBtn" disabled style="margin-top: 10px;">Parse URL Content</button>
                <button type="button" onclick="getRecentPosts()" id="recentPostsBtn" style="margin-top: 10px; margin-left: 10px;">Get 5 Recent Posts</button>
            </div>
            
            <!-- Recent Posts Selection -->
            <div class="form-group" id="recentPostsSection" style="display: none;">
                <label>Select a recent blog post:</label>
                <div id="recentPostsList"></div>
                <button type="button" onclick="createAllBlogs()" id="createAllBtn" style="margin-top: 15px; background-color: #28a745; color: white; font-weight: bold;" disabled>Create All Blogs</button>
            </div>
            
            <div class="form-group">
                <label for="heading">Heading (required):</label>
                <input type="text" id="heading" value="" required>
            </div>
            <div class="form-group">
                <label for="subheading">Subheading (max 255 characters):</label>
                <input type="text" id="subheading" value="" maxlength="255" oninput="updateCharCount('subheading', 'subheadingCount')">
                <small id="subheadingCount" style="color: #666; font-size: 12px;">0/255 characters</small>
            </div>
            <div class="form-group">
                <label for="author">Author (required):</label>
                <input type="text" id="author" value="" required>
            </div>
            <div class="form-group">
                <label for="promoImage">Promo Image URL:</label>
                <input type="url" id="promoImage" value="">
            </div>
            <div class="form-group">
                <label for="body">Body Content (HTML):</label>
                <textarea id="body" placeholder="Enter HTML content here..."></textarea>
            </div>
            <button id="createPostBtn" onclick="createBlogPost()">Create Blog Post</button>
        </div>

        <!-- Status Messages -->
        <div id="statusMessage" class="status"></div>
    </div>

    <script>
        let accessToken = '';
        let recentPostUrls = []; // Store the recent post URLs globally
        let config = {}; // Store configuration from server

        // Load configuration on page load
        async function loadConfig() {
            try {
                const response = await fetch('/api/config');
                if (response.ok) {
                    config = await response.json();
                    
                    // Populate the form fields with config values
                    document.getElementById('cmsUrl').value = config.cmsUrl || '';
                    document.getElementById('clientId').value = config.clientId || '';
                    document.getElementById('clientSecret').value = config.clientSecret || '';
                    
                    
                    showStatus('Configuration loaded successfully!', 'success');
                } else {
                    showStatus('Failed to load configuration from server', 'error');
                }
            } catch (error) {
                showStatus('Error loading configuration: ' + error.message, 'error');
            }
        }

        function showStatus(message, type) {
            const statusDiv = document.getElementById('statusMessage');
            statusDiv.textContent = message;
            statusDiv.className = `status ${type}`;
            statusDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            }
        }

        async function getAccessToken() {
            const getTokenBtn = document.getElementById('getTokenBtn');
            const clientId = document.getElementById('clientId').value || config.clientId;
            const clientSecret = document.getElementById('clientSecret').value || config.clientSecret;
            const cmsUrl = document.getElementById('cmsUrl').value || config.cmsUrl;

            getTokenBtn.disabled = true;
            getTokenBtn.textContent = 'Getting Token...';
            showStatus('Requesting access token...', 'info');

            try {
                const response = await fetch('/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        clientId,
                        clientSecret,
                        cmsUrl
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    accessToken = data.access_token;
                    document.getElementById('accessToken').value = accessToken;
                    showStatus('Access token obtained successfully!', 'success');
                } else {
                    const errorData = await response.json();
                    showStatus(`Failed to get access token: ${response.status} - ${errorData.error || 'Unknown error'}`, 'error');
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
            } finally {
                getTokenBtn.disabled = false;
                getTokenBtn.textContent = 'Get Access Token';
            }
        }

        async function parseUrl() {
            const urlInput = document.getElementById('blogUrl');
            const parseBtn = document.getElementById('parseBtn');
            const url = urlInput.value.trim();
            
            if (!url) {
                showStatus('Please enter a valid URL!', 'error');
                return;
            }

            parseBtn.disabled = true;
            parseBtn.textContent = 'Parsing...';
            showStatus('Parsing webpage content...', 'info');

            try {
                const response = await fetch('/api/parse-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Populate fields with parsed data
                    if (data.title) {
                        document.getElementById('heading').value = data.title;
                    }
                    
                    // Leave ArticleSubHeading blank as requested
                    document.getElementById('subheading').value = '';
                    updateCharCount('subheading', 'subheadingCount');
                    
                    if (data.author) {
                        document.getElementById('author').value = data.author;
                    }
                    
                    if (data.image) {
                        document.getElementById('promoImage').value = data.image;
                    }
                    
                    if (data.content) {
                        document.getElementById('body').value = data.content;
                    }
                    
                    showStatus('Content parsed successfully! Review and edit as needed.', 'success');
                } else {
                    const errorData = await response.json();
                    showStatus(`Failed to parse URL: ${response.status} - ${errorData.error || 'Unknown error'}`, 'error');
                }
            } catch (error) {
                showStatus(`Error parsing URL: ${error.message}`, 'error');
            } finally {
                parseBtn.disabled = false;
                parseBtn.textContent = 'Parse URL Content';
            }
        }

        async function createBlogPost() {
            const createBtn = document.getElementById('createPostBtn');
            const cmsUrl = document.getElementById('cmsUrl').value || config.cmsUrl;
            var containerUuid = document.getElementById('containerUuid').value;
            const heading = document.getElementById('heading').value;
            let subheading = document.getElementById('subheading').value;
            const author = document.getElementById('author').value;
            const promoImage = document.getElementById('promoImage').value;
            const body = document.getElementById('body').value;

            // Remove dashes from Container UUID if present
            containerUuid = containerUuid.replace(/-/g, '');
            document.getElementById('containerUuid').value = containerUuid; // Update the display

            if (!heading || !author) {
                showStatus('Heading and Author are required fields!', 'error');
                return;
            }

            // Automatically truncate subheading if it's too long
            if (subheading.length > 255) {
                subheading = subheading.substring(0, 252) + '...';
                document.getElementById('subheading').value = subheading;
                showStatus('Subheading was automatically truncated to 255 characters.', 'info');
                updateCharCount('subheading', 'subheadingCount');
            }

            createBtn.disabled = true;
            createBtn.textContent = 'Creating Post...';
            showStatus('Getting access token and creating blog post...', 'info');

            try {
                // First, get access token if we don't have one or if it's expired
                if (!accessToken) {
                    showStatus('Getting access token...', 'info');
                    
                    const clientId = document.getElementById('clientId').value || config.clientId;
                    const clientSecret = document.getElementById('clientSecret').value || config.clientSecret;
                    
                    const tokenResponse = await fetch('/api/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            clientId,
                            clientSecret,
                            cmsUrl
                        })
                    });

                    if (tokenResponse.ok) {
                        const tokenData = await tokenResponse.json();
                        accessToken = tokenData.access_token;
                        document.getElementById('accessToken').value = accessToken;
                        showStatus('Access token obtained, now creating blog post...', 'info');
                    } else {
                        const errorData = await tokenResponse.json();
                        showStatus(`Failed to get access token: ${tokenResponse.status} - ${errorData.error || 'Unknown error'}`, 'error');
                        return;
                    }
                }

                // Generate a random UUID for the content
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
                    displayName: heading,
                    properties: {
                        Heading: heading,
                        ArticleSubHeading: subheading,
                        BlogPostBody: body,
                        ArticleAuthor: author,
                        // BlogPostPromoImage: promoImage,
                        SeoSettings: {
                            GraphType: "article"
                        }
                    }
                };

                console.log('Sending blog content:', blogContent);

                const response = await fetch('/api/content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken,
                        cmsUrl,
                        blogContent
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    showStatus(`Blog post created successfully! Content Key: ${result.key || blogContent.key}`, 'success');
                    console.log('Blog post created:', result);
                } else {
                    const errorData = await response.json();
                    
                    // If we get an unauthorized error, try to get a new token and retry
                    if (response.status === 401) {
                        showStatus('Token expired, getting new token and retrying...', 'info');
                        accessToken = ''; // Clear the old token
                        // Recursively call createBlogPost to retry with new token
                        setTimeout(() => createBlogPost(), 1000);
                        return;
                    }
                    
                    showStatus(`Failed to create blog post: ${response.status} - ${errorData.error || 'Unknown error'}`, 'error');
                    console.error('Error details:', errorData);
                }
            } catch (error) {
                showStatus(`Error: ${error.message}`, 'error');
                console.error('Error:', error);
            } finally {
                createBtn.disabled = false;
                createBtn.textContent = 'Create Blog Post';
            }
        }

        async function getRecentPosts() {
            const rssUrlInput = document.getElementById('rssUrl');
            const recentBtn = document.getElementById('recentPostsBtn');
            const recentSection = document.getElementById('recentPostsSection');
            const recentList = document.getElementById('recentPostsList');
            const createAllBtn = document.getElementById('createAllBtn');
            
            const rssUrl = rssUrlInput.value.trim();            

            recentBtn.disabled = true;
            recentBtn.textContent = 'Loading...';
            showStatus('Fetching recent blog posts...', 'info');
            
            try {
                const response = await fetch('/api/get-recent-posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rssUrl })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.urls && data.urls.length > 0) {
                        recentPostUrls = data.urls; // Store URLs globally
                        
                        // Clear previous results
                        recentList.innerHTML = '';
                        
                        // Create buttons for each recent post
                        data.urls.forEach((url, index) => {
                            const postDiv = document.createElement('div');
                            postDiv.style.marginBottom = '10px';
                            
                            const postBtn = document.createElement('button');
                            postBtn.textContent = `Use Post ${index + 1}: ${url}`;
                            postBtn.style.width = '100%';
                            postBtn.style.textAlign = 'left';
                            postBtn.onclick = () => useRecentPost(url);
                            
                            postDiv.appendChild(postBtn);
                            recentList.appendChild(postDiv);
                        });
                        
                        recentSection.style.display = 'block';
                        createAllBtn.disabled = false; // Enable the Create All button
                        showStatus(`Found ${data.urls.length} recent blog posts. Click one to use it, or click "Create All Blogs" to create all of them.`, 'success');
                    } else {
                        showStatus('No recent blog posts found.', 'error');
                    }
                } else {
                    const errorData = await response.json();
                    showStatus(`Failed to fetch recent posts: ${response.status} - ${errorData.error || 'Unknown error'}`, 'error');
                }
            } catch (error) {
                showStatus(`Error fetching recent posts: ${error.message}`, 'error');
            } finally {
                recentBtn.disabled = false;
                recentBtn.textContent = 'Get 5 Recent Posts';
            }
        }

        async function createAllBlogs() {
            if (recentPostUrls.length === 0) {
                showStatus('No blog posts to create. Please fetch recent posts first.', 'error');
                return;
            }

            const createAllBtn = document.getElementById('createAllBtn');
            const cmsUrl = document.getElementById('cmsUrl').value || config.cmsUrl;
            const containerUuid = document.getElementById('containerUuid').value;
            const clientId = document.getElementById('clientId').value || config.clientId;
            const clientSecret = document.getElementById('clientSecret').value || config.clientSecret;

            createAllBtn.disabled = true;
            createAllBtn.textContent = 'Creating All Blogs...';
            showStatus(`Starting bulk creation of ${recentPostUrls.length} blog posts...`, 'info');

            try {
                // First, get access token if we don't have one
                if (!accessToken) {
                    showStatus('Getting access token...', 'info');
                    
                    const tokenResponse = await fetch('/api/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            clientId,
                            clientSecret,
                            cmsUrl
                        })
                    });

                    if (tokenResponse.ok) {
                        const tokenData = await tokenResponse.json();
                        accessToken = tokenData.access_token;
                        document.getElementById('accessToken').value = accessToken;
                        showStatus('Access token obtained, starting bulk creation...', 'info');
                    } else {
                        const errorData = await tokenResponse.json();
                        showStatus(`Failed to get access token: ${tokenResponse.status} - ${errorData.error || 'Unknown error'}`, 'error');
                        return;
                    }
                }

                // Call the bulk creation endpoint
                const response = await fetch('/api/create-all-blogs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken,
                        cmsUrl,
                        containerUuid,
                        urls: recentPostUrls
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    const { summary, results, errors } = result;
                    
                    let statusMessage = `Bulk creation complete! Successfully created ${summary.successful} out of ${summary.total} blog posts.`;
                    
                    if (summary.failed > 0) {
                        statusMessage += ` ${summary.failed} failed.`;
                        console.log('Failed posts:', errors);
                    }
                    
                    showStatus(statusMessage, summary.failed === 0 ? 'success' : 'info');
                    
                    // Log detailed results
                    console.log('Creation Results:', results);
                    if (errors.length > 0) {
                        console.log('Creation Errors:', errors);
                    }
                    
                } else {
                    const errorData = await response.json();
                    showStatus(`Bulk creation failed: ${response.status} - ${errorData.error || 'Unknown error'}`, 'error');
                }

            } catch (error) {
                showStatus(`Error during bulk creation: ${error.message}`, 'error');
                console.error('Bulk creation error:', error);
            } finally {
                createAllBtn.disabled = false;
                createAllBtn.textContent = 'Create All Blogs';
            }
        }

        async function useRecentPost(url) {
            // Set the URL in the input field
            document.getElementById('blogUrl').value = url;
            
            // Hide the recent posts section
            document.getElementById('recentPostsSection').style.display = 'none';
            
            // Enable the parse button and trigger parsing
            document.getElementById('parseBtn').disabled = false;
            
            // Automatically parse the selected URL
            await parseUrl();
        }

        function updateCharCount(inputId, countId) {
            const input = document.getElementById(inputId);
            const counter = document.getElementById(countId);
            const currentLength = input.value.length;
            const maxLength = input.getAttribute('maxlength');
            
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            // Change color when approaching limit
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#d73527';
            } else if (currentLength > maxLength * 0.8) {
                counter.style.color = '#f0ad4e';
            } else {
                counter.style.color = '#666';
            }
        }

        function handleUrlInput() {
            const urlInput = document.getElementById('blogUrl');
            const parseBtn = document.getElementById('parseBtn');
            
            if (urlInput.value.trim()) {
                parseBtn.disabled = false;
            } else {
                parseBtn.disabled = true;
            }
        }

        // Initialize on page load
        window.addEventListener('load', async () => {
            await loadConfig(); // Load configuration first
            showStatus('Ready to create blog posts! Authentication will be handled automatically when you click "Create Blog Post".', 'info');
            updateCharCount('subheading', 'subheadingCount');
        });
    </script>
</body>
</html>