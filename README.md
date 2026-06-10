# ITA Tool - JWT Token Management API

## Features
- Convert Access Token ↔ JWT
- Convert EAT Token ↔ Access Token/JWT
- Convert Guest Token ↔ Access Token/JWT
- Inspect and decode tokens
- Timestamp conversion
- Platform information

## Deployment to Vercel

1. Push this code to GitHub
2. Import the repository in Vercel
3. Deploy!

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Documentation |
| `/api/access-to-jwt` | POST | Access → JWT |
| `/api/eat-to-access` | POST | EAT → Access |
| `/api/eat-to-jwt` | POST | EAT → JWT |
| `/api/guest-to-access` | POST | Guest → Access |
| `/api/guest-to-jwt` | POST | Guest → JWT |
| `/api/inspect-token` | POST | Inspect token |
| `/api/decode-jwt` | POST | Decode JWT |
| `/api/convert-timestamp` | GET | Convert timestamp |
| `/api/platform` | GET | Platform info |
| `/api/endpoints` | GET | List endpoints |

## Usage Example

```bash
# Get documentation
curl https://ita-tool.vercel.app/

# Decode JWT
curl -X POST https://ita-tool.vercel.app/api/decode-jwt \
  -H "Content-Type: application/json" \
  -d '{"token":"your_jwt_token"}'
