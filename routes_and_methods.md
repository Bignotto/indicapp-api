# API Routes and Methods

## Users Routes

- **POST** `/users` - `createNewUser`
- **GET** `/users/:id` - `getUser`
- **PUT** `/users/:id` - `updateUser`
- **DELETE** `/users/:id` - `deleteUser`
- **GET** `/users/email/:email` - `getUserByEmail`
- **PATCH** `/users/:id/phone` - `updateUserPhone`

## Service Types Routes

- **POST** `/service-types` - `createServiceTypeController`
- **GET** `/service-types` - `getServiceTypes`

## Service Sub Types Routes

- **POST** `/service-subtypes` - `createServiceSubTypeController`
- **GET** `/service-subtypes/:parentId` - `getServiceSubTypesByParentId`

## Reviews Routes

- **POST** `/reviews` - `createReview`

## Service Ads Routes

- **POST** `/service-ads` - `createServiceAd`
- **GET** `/service-ads/:id` - `getServiceAdDetails`
- **PUT** `/service-ads/:serviceAdId` - `updateServiceAd`
