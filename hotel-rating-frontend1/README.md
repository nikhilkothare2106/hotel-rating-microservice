# The Ledger — Hotel Rating Frontend

A React (Vite) single-page app for the User / Hotel / Rating microservices, talking to everything
through a single API Gateway URL.

## 1. Install & run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## 2. Point it at your gateway

By default the app calls `http://localhost:8765`. Change this any time in the app itself under
**Settings** (stored in the browser, no rebuild needed), or edit the default in
`src/api/client.js` (`DEFAULT_BASE_URL`).

The app expects these routes to exist behind the gateway (matching the controllers you shared):

```
GET/POST /users
GET      /users/{userId}
GET      /hotels
GET/POST /hotels
GET      /hotels/{id}
GET/POST /ratings
GET      /ratings/{id}
GET      /ratings/users/{userId}
GET      /ratings/hotels/{hotelId}
```

## 3. CORS

Since this runs in the browser on a different origin (`localhost:5173`) than your gateway
(`localhost:8765`), you need CORS enabled on the gateway (or on each service, if you're not
routing through one). For Spring Cloud Gateway, something like:

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods: [GET, POST, PUT, DELETE, OPTIONS]
            allowedHeaders: "*"
```

If you're calling the three services directly instead of through a gateway, add an equivalent
`@CrossOrigin` or `WebMvcConfigurer` CORS setup to each Spring Boot app.

## 4. Entity field assumptions

Your controllers didn't show the entity classes, so the forms assume these fields (the common
shape for this project). If your entities differ, the only files that need edits are the three
files in `src/api/` plus the corresponding form/list JSX in `src/pages/`:

- **User** — `userId` (server-generated), `name`, `email`, `about`
- **Hotel** — `id` (server-generated), `name`, `location`, `about`
- **Rating** — `ratingId` (server-generated), `userId`, `hotelId`, `rating` (1–5), `feedback`

If a field name is off (e.g. your `Hotel` id is called `hotelId` instead of `id`), search for it
in `src/pages/Hotels.jsx`, `src/pages/HotelDetail.jsx`, and `src/api/hotels.js` and rename.

## 5. What's included

- **Dashboard** — counts + latest ratings across the system
- **Guests** — list, register a new guest, guest profile with their rating history
- **Hotels** — list, list a new hotel, hotel profile with reviews + average rating stamp
- **Ratings** — full guestbook list + form to log a new rating (guest + hotel dropdowns, star
  picker, feedback)
- **Settings** — change the gateway URL at runtime, test the connection

Every list/detail page handles loading, empty, and error states (e.g. gateway unreachable,
service down) — errors from your `CircuitBreaker`/fallback responses will just render as normal
data, since they come back as valid `200 OK` JSON.

## 6. Build for production

```bash
npm run build
```

Outputs static files to `dist/`, which you can serve from any static host or behind the same
gateway.

## 7. Docker

```bash
docker build --build-arg VITE_API_BASE_URL=http://<your-host>:8084 -t hotel-rating-frontend .
docker run -p 8080:80 hotel-rating-frontend
```

Then open `http://localhost:8080`.

**Important:** `VITE_API_BASE_URL` gets baked into the static JS at build time and is called
directly from the *user's browser*, not from inside the Docker network. So it must be an address
your browser can reach — e.g. `http://localhost:8084` if the gateway container publishes that
port on your machine, or `http://<server-ip>:8084` / a public hostname if you're deploying
somewhere. Do **not** use a Docker Compose service name like `http://gateway:8084` here — that
only resolves inside the Docker network, not in the browser.

If you're using Docker Compose, a typical setup looks like:

```yaml
services:
  gateway:
    # ... your existing gateway service
    ports:
      - "8084:8084"

  frontend:
    build:
      context: ./hotel-rating-frontend
      args:
        VITE_API_BASE_URL: http://localhost:8084   # or your host's real IP/domain
    ports:
      - "8080:80"
```

### Changing the URL later without rebuilding

You don't have to rebuild the image to point at a different gateway — open the running app,
go to **Settings**, and change the gateway URL there. It's saved in the browser (`localStorage`)
and overrides the build-time default immediately. This is the fastest option if you're just
testing against a different host/port.
