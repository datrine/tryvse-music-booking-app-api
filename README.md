# API Documentation 
## Overview
Music Booking App to allow users book artistes for events.

## Quick start
```
git clone https://github.com/datrine/tryvse-music-booking-app-api.git
cd tryvse-music-booking-app-api
yarn install
touch .env
yarn start:dev
```
- Remember to set up environment files templated in .env.sample

## APIs
Full api documentation available on 
- Local [Local] (http://localhost:3000/api/docs)
- Remote [Music Booking App](https://tryvse-music-booking-app-api.onrender.com/api/docs#/)

### Artist Profile
#### Create Artist Profile
- POST /api/v1/artist_profiles

#### Get Multiple Artist Profile
- GET /api/v1/artist_profiles

#### Update Artist Profile
- PUT /api/v1/artist_profiles/:id

#### Delete Artist Profile
- PUT /api/v1/artist_profiles/:id


### Authentication
#### Sign in Artist
- POST /api/v1/auth/signin


### Booking Profile
#### Create Booking
- POST /api/v1/booking_transactions

#### Get Multiple Bookings (filterable)
- GET /api/v1/booking_transactions


#### Update Booking
- PUT /api/v1/booking_transactions/:id/status/actions/confirm

#### Confirm Booking
- PUT /api/v1/booking_transactions/:id/status/actions/confirm

#### Cancel Booking
- PUT /api/v1/booking_transactions/:id/status/actions/cancel

### Event Listing APIs
#### Get Events (filterable)
- GET /api/v1/event_listing

#### Get Event by Id
- GET /api/v1/event_listing/:id