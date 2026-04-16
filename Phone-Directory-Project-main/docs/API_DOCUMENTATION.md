# Contact Book Application - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Currently, the API does not require authentication. (For production web deployment, implement JWT-based authentication as described in ARCHITECTURE.md)

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "error": "Description of the error"
}
```

---

## Endpoints

### 1. Health Check

**Endpoint**: `GET /health`

**Description**: Check if the API is running

**Request**:
```bash
curl http://localhost:3001/api/health
```

**Response** (200 OK):
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Contact Operations

#### 2.1 Create Contact

**Endpoint**: `POST /contacts`

**Description**: Create a new contact

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "birthDate": "1990-01-15",
  "notes": "Regular client"
}
```

**Required Fields**:
- `firstName` (string) - Contact's first name

**Optional Fields**:
- `lastName` (string)
- `email` (string) - Must be valid email format, unique
- `phone` (string) - Must be unique
- `address` (string)
- `city` (string)
- `state` (string)
- `zipCode` (string)
- `country` (string)
- `birthDate` (string) - ISO 8601 format (YYYY-MM-DD)
- `notes` (string)

**Response** (201 Created):
```json
{
  "message": "Contact created successfully",
  "id": 1
}
```

**Error Responses**:
- 400 Bad Request:
  ```json
  {"error": "First name is required"}
  ```
- 400 Bad Request (Duplicate):
  ```json
  {"error": "Email or phone number already exists"}
  ```

**Example Request**:
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "5551234567"
  }'
```

---

#### 2.2 Get All Contacts

**Endpoint**: `GET /contacts`

**Description**: Retrieve all contacts

**Request**:
```bash
curl http://localhost:3001/api/contacts
```

**Response** (200 OK):
```json
{
  "total": 2,
  "contacts": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "birthDate": "1990-01-15",
      "notes": "Regular client",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 2.3 Get Contact by ID

**Endpoint**: `GET /contacts/:id`

**Description**: Retrieve a specific contact

**Path Parameters**:
- `id` (integer) - Contact ID

**Request**:
```bash
curl http://localhost:3001/api/contacts/1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "birthDate": "1990-01-15",
  "notes": "Regular client",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response** (404 Not Found):
```json
{"error": "Contact not found"}
```

---

#### 2.4 Update Contact

**Endpoint**: `PUT /contacts/:id`

**Description**: Update an existing contact

**Path Parameters**:
- `id` (integer) - Contact ID

**Request Body**:
```json
{
  "firstName": "Johnny",
  "email": "johnny@example.com"
}
```

Note: Only include fields you want to update. Other fields remain unchanged.

**Request**:
```bash
curl -X PUT http://localhost:3001/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Johnny"}'
```

**Response** (200 OK):
```json
{"message": "Contact updated successfully"}
```

**Error Responses**:
- 404 Not Found:
  ```json
  {"error": "Contact not found"}
  ```
- 400 Bad Request:
  ```json
  {"error": "Email or phone number already exists"}
  ```

---

#### 2.5 Delete Contact

**Endpoint**: `DELETE /contacts/:id`

**Description**: Delete a contact

**Path Parameters**:
- `id` (integer) - Contact ID

**Request**:
```bash
curl -X DELETE http://localhost:3001/api/contacts/1
```

**Response** (200 OK):
```json
{"message": "Contact deleted successfully"}
```

**Error Response** (404 Not Found):
```json
{"error": "Contact not found"}
```

---

### 3. Search Operations

#### 3.1 Search Contacts (All Fields)

**Endpoint**: `GET /contacts/search?query=<search_term>`

**Description**: Search across all fields (name, email, phone)

**Query Parameters**:
- `query` (string) - Search term (required)

**Request**:
```bash
curl "http://localhost:3001/api/contacts/search?query=John"
```

**Response** (200 OK):
```json
{
  "query": "John",
  "total": 1,
  "contacts": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      ...
    }
  ]
}
```

**Error Response** (400 Bad Request):
```json
{"error": "Search query is required"}
```

---

#### 3.2 Search by Name

**Endpoint**: `GET /contacts/search/by-name?name=<name>`

**Description**: Search contacts by first or last name

**Query Parameters**:
- `name` (string) - Name to search (required)

**Request**:
```bash
curl "http://localhost:3001/api/contacts/search/by-name?name=Doe"
```

**Response** (200 OK):
```json
{
  "total": 1,
  "contacts": [...]
}
```

---

#### 3.3 Search by Phone

**Endpoint**: `GET /contacts/search/by-phone?phone=<phone>`

**Description**: Search contact by phone number

**Query Parameters**:
- `phone` (string) - Phone number to search (required)

**Request**:
```bash
curl "http://localhost:3001/api/contacts/search/by-phone?phone=5551234567"
```

**Response** (200 OK):
```json
{
  "total": 1,
  "contacts": [...]
}
```

**No Match Response**:
```json
{
  "message": "No contact found with this phone number",
  "contacts": []
}
```

---

#### 3.4 Search by Email

**Endpoint**: `GET /contacts/search/by-email?email=<email>`

**Description**: Search contact by email address

**Query Parameters**:
- `email` (string) - Email address to search (required)

**Request**:
```bash
curl "http://localhost:3001/api/contacts/search/by-email?email=john@example.com"
```

**Response** (200 OK):
```json
{
  "total": 1,
  "contacts": [...]
}
```

---

### 4. Merge Contacts

**Endpoint**: `POST /contacts/merge`

**Description**: Merge two contacts (secondary is deleted)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "primaryId": 1,
  "secondaryId": 2
}
```

**Request**:
```bash
curl -X POST http://localhost:3001/api/contacts/merge \
  -H "Content-Type: application/json" \
  -d '{
    "primaryId": 1,
    "secondaryId": 2
  }'
```

**Response** (200 OK):
```json
{
  "message": "Contacts merged successfully",
  "primaryId": 1,
  "mergedContact": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    ...
  }
}
```

**Merge Logic**:
- Primary contact's data is kept
- Empty fields in primary are filled from secondary
- Notes are concatenated with "---Merged---" separator
- Secondary contact is deleted
- Merge record is created for audit trail

**Error Responses**:
- 400 Bad Request (Missing parameters):
  ```json
  {"error": "Both primaryId and secondaryId are required"}
  ```
- 400 Bad Request (Same contact):
  ```json
  {"error": "Cannot merge a contact with itself"}
  ```
- 404 Not Found:
  ```json
  {"error": "One or both contacts not found"}
  ```

---

## Data Types & Validation

### Field Validation

| Field | Type | Rules |
|-------|------|-------|
| firstName | string | Required, non-empty |
| lastName | string | Optional |
| email | string | Optional, unique, valid email format |
| phone | string | Optional, unique, 10+ digits |
| address | string | Optional |
| city | string | Optional |
| state | string | Optional |
| zipCode | string | Optional |
| country | string | Optional |
| birthDate | string | Optional, ISO 8601 format (YYYY-MM-DD) |
| notes | string | Optional |

### Email Validation
- Must contain '@'
- Must have domain extension

### Phone Validation
- Must contain at least 10 digits
- Non-digit characters are allowed (will be preserved)

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, implement:
- 100 requests per minute per IP
- 1000 requests per hour per user (after auth)

---

## CORS Policy

**Allowed Origins**: All origins (for development)

For production, restrict to specific domains in `app.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
}));
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Example Workflows

### Workflow 1: Complete Contact Lifecycle

```bash
# 1. Create contact
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "email": "jane@example.com",
    "phone": "5559876543"
  }'
# Response: {"message":"Contact created successfully","id":1}

# 2. Get the contact
curl http://localhost:3001/api/contacts/1

# 3. Update the contact
curl -X PUT http://localhost:3001/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{"lastName": "Smith"}'

# 4. Search for the contact
curl "http://localhost:3001/api/contacts/search?query=Jane"

# 5. Delete the contact
curl -X DELETE http://localhost:3001/api/contacts/1
```

### Workflow 2: Merge Two Contacts

```bash
# 1. Create first contact
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "email": "john1@example.com"}'
# Response: {"id": 1}

# 2. Create second contact (duplicate)
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "email": "john2@example.com", "phone": "5551234567"}'
# Response: {"id": 2}

# 3. Merge contacts
curl -X POST http://localhost:3001/api/contacts/merge \
  -H "Content-Type: application/json" \
  -d '{
    "primaryId": 1,
    "secondaryId": 2
  }'

# 4. Verify merge - contact 2 should be gone
curl http://localhost:3001/api/contacts/2
# Response: {"error": "Contact not found"}
```

---

## Testing with cURL

### Test All Endpoints
```bash
#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "1. Health Check"
curl $BASE_URL/health

echo -e "\n2. Create Contact"
curl -X POST $BASE_URL/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","email":"test@example.com"}'

echo -e "\n3. Get All Contacts"
curl $BASE_URL/contacts

echo -e "\n4. Search Contacts"
curl "$BASE_URL/contacts/search?query=Test"
```

---

## Postman Collection

See `postman-collection.json` for ready-to-use API requests in Postman.

---

**API Version**: 1.0
**Last Updated**: 2024
