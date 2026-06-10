// api/index.js
const dangerFfjwt = require('danger-ffjwt');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const url = req.url;
    const path = url.split('?')[0];
    
    // Root path - show documentation
    if (path === '/' || path === '/api' || path === '/api/') {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
    <title>JWT API - ITA Tool</title>
    <style>
        body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; }
        h1 { color: #667eea; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
        code { background: #2d2d2d; color: #f8f8f2; padding: 10px; display: block; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 JWT Token Management API</h1>
        <p>Base URL: <strong>${req.headers.host}</strong></p>
        
        <h2>Available Endpoints:</h2>
        
        <div class="endpoint">
            <h3>GET /api/platform</h3>
            <p>Get platform information</p>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/convert-timestamp</h3>
            <p>Convert timestamp to readable date</p>
            <code>curl ${req.headers.origin}/api/convert-timestamp?timestamp=1609459200</code>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/access-to-jwt</h3>
            <p>Convert Access Token to JWT</p>
            <code>curl -X POST ${req.headers.origin}/api/access-to-jwt -H "Content-Type: application/json" -d '{"token":"your_token"}'</code>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/eat-to-access</h3>
            <p>Convert EAT Token to Access Token</p>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/eat-to-jwt</h3>
            <p>Convert EAT Token to JWT</p>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/guest-to-access</h3>
            <p>Convert Guest Token to Access Token</p>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/guest-to-jwt</h3>
            <p>Convert Guest Token to JWT</p>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/inspect-token</h3>
            <p>Inspect Access Token</p>
        </div>
        
        <div class="endpoint">
            <h3>POST /api/decode-jwt</h3>
            <p>Decode JWT Token</p>
        </div>
        
        <div class="endpoint">
            <h3>GET /api/endpoints</h3>
            <p>List all endpoints</p>
        </div>
    </div>
</body>
</html>
        `);
    }
    
    // Helper function for responses
    const successResponse = (data, message = 'Success') => ({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
    
    const errorResponse = (message, statusCode = 400) => ({
        success: false,
        error: message,
        statusCode,
        timestamp: new Date().toISOString()
    });
    
    const getToken = () => {
        if (req.body && req.body.token) return req.body.token;
        if (req.query && req.query.token) return req.query.token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return null;
    };
    
    // Handle endpoints
    try {
        // GET endpoints (no token required)
        if (path === '/api/endpoints') {
            return res.status(200).json(successResponse([
                'access-to-jwt', 'eat-to-access', 'eat-to-jwt', 'guest-to-access',
                'guest-to-jwt', 'inspect-token', 'decode-jwt', 'convert-timestamp', 'platform'
            ], 'Available endpoints'));
        }
        
        if (path === '/api/platform') {
            const result = dangerFfjwt.get_platform_name();
            return res.status(200).json(successResponse(result, 'Platform info'));
        }
        
        if (path === '/api/convert-timestamp') {
            let timestamp = req.query.timestamp;
            if (!timestamp) timestamp = Math.floor(Date.now() / 1000);
            else timestamp = parseInt(timestamp);
            const result = dangerFfjwt.convert_timestamp(timestamp);
            return res.status(200).json(successResponse(result, 'Timestamp converted'));
        }
        
        // POST endpoints (require token)
        const operation = path.replace('/api/', '');
        const validOps = ['access-to-jwt', 'eat-to-access', 'eat-to-jwt', 'guest-to-access', 'guest-to-jwt', 'inspect-token', 'decode-jwt'];
        
        if (validOps.includes(operation)) {
            const token = getToken();
            if (!token) {
                return res.status(400).json(errorResponse('Token required', 400));
            }
            
            let result;
            switch(operation) {
                case 'access-to-jwt': result = dangerFfjwt.access_to_jwt(token); break;
                case 'eat-to-access': result = dangerFfjwt.eat_to_access(token); break;
                case 'eat-to-jwt': result = dangerFfjwt.eat_to_jwt(token); break;
                case 'guest-to-access': result = dangerFfjwt.guest_to_access(token); break;
                case 'guest-to-jwt': result = dangerFfjwt.guest_to_jwt(token); break;
                case 'inspect-token': result = dangerFfjwt.inspect_access_token(token); break;
                case 'decode-jwt': result = dangerFfjwt.decode_jwt(token); break;
            }
            return res.status(200).json(successResponse(result, `${operation} completed`));
        }
        
        // 404 for unknown endpoints
        return res.status(404).json(errorResponse(`Endpoint not found: ${path}`, 404));
        
    } catch (error) {
        return res.status(500).json(errorResponse(error.message, 500));
    }
};
