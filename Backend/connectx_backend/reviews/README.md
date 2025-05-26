# Review System API Documentation

This enhanced review system provides comprehensive endpoints for managing product reviews with detailed statistics and seamless integration with the existing ConnectX platform.

## Features

- ✅ Create, read, update, and delete reviews
- ✅ Purchase verification (users must buy products before reviewing)
- ✅ Comprehensive review statistics with rating distribution
- ✅ Review summary integrated in product endpoints
- ✅ Pagination support for large datasets
- ✅ Tenant-based isolation
- ✅ Swagger/OpenAPI documentation
- ✅ Comprehensive test coverage

## API Endpoints

### Core Review Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/reviews/` | Create a new review | Required |
| `GET` | `/api/reviews/` | List all reviews | Optional |
| `GET` | `/api/reviews/{id}/` | Get specific review | Optional |
| `PUT/PATCH` | `/api/reviews/{id}/` | Update review (own only) | Required |
| `DELETE` | `/api/reviews/{id}/` | Delete review (own only) | Required |

### Review Query Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/reviews/my_reviews/` | Get current user's reviews | Required |
| `GET` | `/api/reviews/product-reviews/` | Get reviews for specific product | Optional |
| `GET` | `/api/reviews/product-stats/` | Get review statistics for product | Optional |
| `GET` | `/api/reviews/product-summary/` | Get reviews + stats for product | Optional |
| `GET` | `/api/reviews/stats/` | Get overall review statistics | Required |

## Request/Response Examples

### Create Review

**Request:**
```http
POST /api/reviews/
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "product": "uuid-of-product",
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

**Response:**
```json
{
  "id": "review-uuid",
  "product": "product-uuid",
  "user": "user-uuid",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "rating": 5,
  "comment": "Excellent product! Highly recommended.",
  "is_purchased": true,
  "created_at": "2025-01-27T10:30:00Z",
  "updated_at": "2025-01-27T10:30:00Z"
}
```

### Get Product Reviews

**Request:**
```http
GET /api/reviews/product-reviews/?product_id=uuid-of-product&page=1&page_size=10
```

**Response:**
```json
{
  "count": 150,
  "next": "http://api/reviews/product-reviews/?page=2",
  "previous": null,
  "results": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Great product!",
      "user_name": "John Doe",
      "created_at": "2025-01-27T10:30:00Z"
    }
  ]
}
```

### Get Product Statistics

**Request:**
```http
GET /api/reviews/product-stats/?product_id=uuid-of-product
```

**Response:**
```json
{
  "total_reviews": 150,
  "average_rating": 4.2,
  "rating_distribution": {
    "1": 5,
    "2": 10,
    "3": 25,
    "4": 60,
    "5": 50
  }
}
```

### Get Product Summary (Reviews + Stats)

**Request:**
```http
GET /api/reviews/product-summary/?product_id=uuid-of-product&limit=5
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Great product!",
      "user_name": "John Doe",
      "created_at": "2025-01-27T10:30:00Z"
    }
  ],
  "stats": {
    "total_reviews": 150,
    "average_rating": 4.2,
    "rating_distribution": {
      "1": 5,
      "2": 10,
      "3": 25,
      "4": 60,
      "5": 50
    }
  }
}
```

## Product Integration

The review system is seamlessly integrated into product endpoints. Every product response now includes a `review_summary` field:

```json
{
  "id": "product-uuid",
  "name": "Amazing Product",
  "base_price": "99.99",
  "review_summary": {
    "total_reviews": 45,
    "average_rating": 4.3,
    "rating_distribution": {
      "1": 1,
      "2": 2,
      "3": 8,
      "4": 15,
      "5": 19
    }
  },
  // ... other product fields
}
```

## Business Rules

1. **Purchase Verification**: Users must have a delivered order containing the product before they can review it
2. **One Review Per Product**: Users can only leave one review per product per tenant
3. **Rating Range**: Ratings must be between 1 and 5 (inclusive)
4. **Ownership**: Users can only update/delete their own reviews
5. **Tenant Isolation**: Reviews are isolated by tenant

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10, max: 100)

### Filtering
- `product_id`: Filter reviews by product UUID
- `limit`: Limit number of reviews in summary endpoint (default: 10)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied (e.g., not purchased, already reviewed)
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limiting exceeded

## Permissions

- **Anonymous Users**: Can view reviews and statistics
- **Authenticated Users**: Can create, view, update (own), and delete (own) reviews
- **Tenant Owners/Members**: Can view all reviews within their tenant

## Database Optimization

The system automatically updates product review statistics to avoid expensive real-time calculations:
- `total_reviews`: Updated on create/delete
- `total_ratings`: Updated on create/update/delete (average rating)

## Testing

Run the comprehensive test suite:

```bash
python manage.py test reviews.tests.ReviewSystemTestCase
```

Tests cover:
- Review creation with purchase verification
- Duplicate review prevention
- Statistics calculation
- Product integration
- Permissions and authentication
- Error scenarios

## Best Practices

1. **Performance**: Use the product summary endpoint for displaying reviews with stats to minimize API calls
2. **Caching**: Consider implementing caching for frequently accessed review statistics
3. **Rate Limiting**: Implement rate limiting for review creation to prevent spam
4. **Moderation**: Consider implementing review moderation workflows for quality control

## Future Enhancements

- Review helpfulness voting
- Review moderation system
- Review photos/attachments
- Review response system for merchants
- Advanced filtering (by rating, date range, verified purchases)
- Review sentiment analysis 