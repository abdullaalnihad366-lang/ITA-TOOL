const { 
    getTokenFromRequest, 
    successResponse, 
    errorResponse, 
    validateToken,
    handleOperation,
    getAvailableOperations
} = require('../utils/jwt-helpers');

// HTML documentation page
const getDocumentationHTML = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Token Management API - Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .base-url {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            font-family: monospace;
            font-size: 1.1em;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        
        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .endpoint-card {
            background: #f8f9fa;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #e0e0e0;
        }
        
        .endpoint-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .endpoint-header {
            background: #667eea;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .endpoint-method {
            background: rgba(255,255,255,0.2);
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 0.85em;
        }
        
        .endpoint-path {
            font-family: monospace;
            font-size: 1.1em;
            font-weight: bold;
        }
        
        .endpoint-body {
            padding: 20px;
        }
        
        .endpoint-description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .code-block {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            margin: 10px 0;
        }
        
        .try-button {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            margin-top: 10px;
            transition: background 0.2s;
        }
        
        .try-button:hover {
            background: #5a67d8;
        }
        
        .response-area {
            background: #f1f3f4;
            border-radius: 8px;
            padding: 10px;
            margin-top: 10px;
            display: none;
            font-family: monospace;
            font-size: 0.85em;
            overflow-x: auto;
        }
        
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.75em;
            font-weight: bold;
            margin-left: 10px;
        }
        
        .badge-token {
            background: #ffc107;
            color: #000;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        
        @media (max-width: 768px) {
            .endpoint-grid {
                grid-template-columns: 1fr;
            }
            .header h1 {
                font-size: 2em;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 JWT Token Management API</h1>
            <p>Complete REST API for JWT token operations</p>
            <div class="base-url">
                🌐 Base URL: <span id="baseUrl"></span>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>📋 Available Endpoints</h2>
                <div class="endpoint-grid" id="endpoints">
                    <!-- Endpoints will be loaded dynamically -->
                </div>
            </div>
            
            <div class="section">
                <h2>🚀 Quick Start Examples</h2>
                
                <h3>cURL Examples:</h3>
                <div class="code-block">
                    # Convert Access Token to JWT<br>
                    curl -X POST <span class="baseUrlPlaceholder">YOUR_API_URL</span>/api/access-to-jwt \<br>
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br>
                    &nbsp;&nbsp;-d '{"token": "your_token_here"}'
                    <br><br>
                    # Decode JWT<br>
                    curl -X POST <span class="baseUrlPlaceholder">YOUR_API_URL</span>/api/decode-jwt \<br>
                    &nbsp;&nbsp;-H "Authorization: Bearer your_jwt_token_here"
                    <br><br>
                    # Convert Timestamp<br>
                    curl <span class="baseUrlPlaceholder">YOUR_API_URL</span>/api/convert-timestamp?timestamp=1609459200
                </div>
                
                <h3>Python Examples:</h3>
                <div class="code-block">
                    import requests<br><br>
                    # POST request<br>
                    response = requests.post(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;'<span class="baseUrlPlaceholder">YOUR_API_URL</span>/api/access-to-jwt',<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;json={'token': 'your_token_here'}<br>
                    )<br>
                    print(response.json())
                </div>
                
                <h3>JavaScript/Fetch Examples:</h3>
                <div class="code-block">
                    // POST request<br>
                    const response = await fetch('<span class="baseUrlPlaceholder">YOUR_API_URL</span>/api/access-to-jwt', {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST',<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;headers: { 'Content-Type': 'application/json' },<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;body: JSON.stringify({ token: 'your_token_here' })<br>
                    });<br>
                    const data = await response.json();
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>JWT Token Management API | Built with ❤️ for Vercel</p>
            <p>All endpoints support CORS | Response format: JSON</p>
        </div>
    </div>
    
    <script>
        const baseUrl = window.location.origin;
        document.getElementById('baseUrl').textContent = baseUrl;
        
        // Replace placeholders
        document.querySelectorAll('.baseUrlPlaceholder').forEach(el => {
            const placeholder = document.createElement('span');
            placeholder.textContent = baseUrl;
            el.parentNode.replaceChild(placeholder, el);
        });
        
        // Load endpoints dynamically
        async function loadEndpoints() {
            try {
                const response = await fetch('/api/endpoints');
                const data = await response.json();
                
                if (data.success) {
                    const endpointsContainer = document.getElementById('endpoints');
                    const operations = data.data;
                    
                    for (const [op, details] of Object.entries(operations)) {
                        const card = document.createElement('div');
                        card.className = 'endpoint-card';
                        
                        const methods = details.method.join(', ');
                        const requiresToken = details.requiresToken;
                        
                        card.innerHTML = `
                            <div class="endpoint-header">
                                <span class="endpoint-path">/api/${op}</span>
                                <span class="endpoint-method">${methods}</span>
                            </div>
                            <div class="endpoint-body">
                                <div class="endpoint-description">
                                    ${details.description}
                                    ${requiresToken ? '<span class="badge badge-token">Requires Token</span>' : '<span class="badge">No Token Required</span>'}
                                </div>
                                <div class="code-block">
                                    ${getExampleCode(op, details, baseUrl)}
                                </div>
                                <button class="try-button" onclick="tryEndpoint('${op}')">▶ Try it out</button>
                                <div id="response-${op}" class="response-area"></div>
                            </div>
                        `;
                        
                        endpointsContainer.appendChild(card);
                    }
                }
            } catch (error) {
                console.error('Error loading endpoints:', error);
            }
        }
        
        function getExampleCode(operation, details, baseUrl) {
            if (details.requiresToken) {
                return `curl -X POST ${baseUrl}/api/${operation} \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(details.example, null, 2)}'`;
            } else if (operation === 'convert-timestamp') {
                return `curl "${baseUrl}/api/${operation}?timestamp=1609459200"`;
            } else {
                return `curl "${baseUrl}/api/${operation}"`;
            }
        }
        
        window.tryEndpoint = async function(operation) {
            const responseDiv = document.getElementById(`response-${operation}`);
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = '<div style="padding: 10px;">⏳ Sending request...</div>';
            
            let url = `/api/${operation}`;
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            // Special handling for timestamp and platform
            if (operation === 'convert-timestamp') {
                options.method = 'GET';
                url += '?timestamp=' + Math.floor(Date.now() / 1000);
                delete options.headers;
            } else if (operation === 'platform') {
                options.method = 'GET';
                delete options.headers;
            } else {
                options.body = JSON.stringify({ token: 'YOUR_TOKEN_HERE' });
            }
            
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                responseDiv.innerHTML = `<pre style="padding: 10px; margin: 0;">${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
                responseDiv.innerHTML = `<div style="padding: 10px; color: red;">Error: ${error.message}</div>`;
            }
        };
        
        loadEndpoints();
    </script>
</body>
</html>
`;

module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const url = req.url;
    const path = url.split('?')[0];
    
    // Serve documentation for root path
    if (path === '/' || path === '/api' || path === '/api/') {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(getDocumentationHTML());
    }
    
    // Get endpoints list
    if (path === '/api/endpoints') {
        const operations = getAvailableOperations();
        return res.status(200).json(successResponse(operations, 'Available endpoints retrieved'));
    }
    
    // Extract operation from path
    let operation = path.replace('/api/', '').replace(/^\/+|\/+$/g, '');
    
    if (!operation) {
        // Redirect to documentation
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(getDocumentationHTML());
    }
    
    try {
        // Special handling for platform (no token required)
        if (operation === 'platform') {
            const result = await handleOperation('platform');
            return res.status(200).json(successResponse(result, 'Platform info retrieved'));
        }
        
        // Special handling for timestamp conversion
        if (operation === 'convert-timestamp') {
            const timestamp = req.query.timestamp || req.body?.timestamp;
            const result = await handleOperation('timestamp', null, timestamp);
            return res.status(200).json(successResponse(result, 'Timestamp converted successfully'));
        }
        
        // All other operations require token
        const token = getTokenFromRequest(req);
        validateToken(token);
        
        const result = await handleOperation(operation, token);
        res.status(200).json(successResponse(result, `${operation} completed successfully`));
    } catch (error) {
        console.error('API Error:', error);
        
        // Check if operation exists
        const operations = getAvailableOperations();
        if (!operations[operation]) {
            return res.status(404).json(errorResponse(`Operation '${operation}' not found. Visit /api to see available endpoints.`, 404));
        }
        
        res.status(400).json(errorResponse(error.message, 400, error.stack));
    }
};
