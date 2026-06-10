const dangerFfjwt = require('danger-ffjwt');

// Helper function to get token from request
function getTokenFromRequest(req) {
    // Check body
    if (req.body && req.body.token) return req.body.token;
    
    // Check query params
    if (req.query && req.query.token) return req.query.token;
    
    // Check headers (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    return null;
}

// Format successful response
function successResponse(data, message = 'Success') {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}

// Format error response
function errorResponse(message, statusCode = 400, details = null) {
    return {
        success: false,
        error: message,
        statusCode,
        details,
        timestamp: new Date().toISOString()
    };
}

// Validate token presence
function validateToken(token, required = true) {
    if (required && (!token || token.trim() === '')) {
        throw new Error('Token is required');
    }
    return token ? token.trim() : null;
}

// Handle async operations
async function handleOperation(operation, token, ...args) {
    switch(operation) {
        case 'access-to-jwt':
        case 'accessToJwt':
            return dangerFfjwt.access_to_jwt(token);
        case 'eat-to-access':
        case 'eatToAccess':
            return dangerFfjwt.eat_to_access(token);
        case 'eat-to-jwt':
        case 'eatToJwt':
            return dangerFfjwt.eat_to_jwt(token);
        case 'guest-to-access':
        case 'guestToAccess':
            return dangerFfjwt.guest_to_access(token);
        case 'guest-to-jwt':
        case 'guestToJwt':
            return dangerFfjwt.guest_to_jwt(token);
        case 'inspect':
        case 'inspect-token':
        case 'inspectToken':
            return dangerFfjwt.inspect_access_token(token);
        case 'decode':
        case 'decode-jwt':
        case 'decodeJwt':
            return dangerFfjwt.decode_jwt(token);
        case 'platform':
        case 'get-platform':
        case 'platform-name':
            return dangerFfjwt.get_platform_name();
        case 'timestamp':
        case 'convert-timestamp':
            const ts = args[0] || Math.floor(Date.now() / 1000);
            return dangerFfjwt.convert_timestamp(parseInt(ts));
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
}

// Get all available operations
function getAvailableOperations() {
    return {
        'access-to-jwt': {
            method: ['GET', 'POST'],
            description: 'Convert Access Token to JWT',
            requiresToken: true,
            example: {
                token: 'your_access_token_here'
            }
        },
        'eat-to-access': {
            method: ['GET', 'POST'],
            description: 'Convert EAT Token to Access Token',
            requiresToken: true,
            example: {
                token: 'your_eat_token_here'
            }
        },
        'eat-to-jwt': {
            method: ['GET', 'POST'],
            description: 'Convert EAT Token directly to JWT',
            requiresToken: true,
            example: {
                token: 'your_eat_token_here'
            }
        },
        'guest-to-access': {
            method: ['GET', 'POST'],
            description: 'Convert Guest Token to Access Token',
            requiresToken: true,
            example: {
                token: 'your_guest_token_here'
            }
        },
        'guest-to-jwt': {
            method: ['GET', 'POST'],
            description: 'Convert Guest Token to JWT',
            requiresToken: true,
            example: {
                token: 'your_guest_token_here'
            }
        },
        'inspect-token': {
            method: ['GET', 'POST'],
            description: 'Inspect Access Token details',
            requiresToken: true,
            example: {
                token: 'your_access_token_here'
            }
        },
        'decode-jwt': {
            method: ['GET', 'POST'],
            description: 'Decode JWT token payload',
            requiresToken: true,
            example: {
                token: 'your_jwt_token_here'
            }
        },
        'convert-timestamp': {
            method: ['GET', 'POST'],
            description: 'Convert Unix timestamp to readable date',
            requiresToken: false,
            parameters: {
                timestamp: 'Unix timestamp (optional, defaults to current time)'
            },
            example: {
                timestamp: 1609459200
            }
        },
        'platform': {
            method: ['GET'],
            description: 'Get platform name and information',
            requiresToken: false,
            example: {}
        }
    };
}

module.exports = {
    getTokenFromRequest,
    successResponse,
    errorResponse,
    validateToken,
    handleOperation,
    getAvailableOperations
};
