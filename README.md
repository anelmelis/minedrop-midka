# MineDrop Shop Store

MineDrop Shop Store is a responsive multi-page e-commerce website created as a midterm project.

The website is designed for Minecraft-inspired merchandise and allows users to browse products, save favorite items, manage a booking cart, proceed to payment, log in, and view profile information.

## Pages

- Home
- Products
- Saved
- Booking
- Payment
- Login
- Profile

## Main Features

- Responsive multi-page website
- Navigation between all main pages
- Product search
- Product category filtering
- Product details popup
- Save products using localStorage
- Saved items page
- Remove saved products
- Sort saved products by name and price
- Add products from Saved to Booking cart
- Shopping cart with quantity and total price
- Booking page
- Payment page
- Login page
- User profile page
- Order history table
- Responsive design for desktop, tablet, and mobile
- Bootstrap grid system
- Bootstrap utility classes
- Flexbox layout
- CSS Grid layout
- HTML forms
- HTML table
- Semantic HTML5 elements
- LocalStorage for saved products and cart data

## Technologies Used

- HTML
- CSS
- JavaScript
- Bootstrap 5
- Local Storage
- Google Fonts

## Project Structure

```text
minedrop-midka/
│
├── home/
│   ├── main.html
│   └── main.css
│
├── products/
│   ├── products.html
│   ├── products.css
│   └── products.js
│
├── saved/
│   ├── saved.html
│   ├── saved.css
│   └── saved.js
│
├── booking/
│   ├── booking.html
│   ├── booking.css
│   └── booking.js
│
├── payment/
│   ├── payment.html
│   ├── payment.css
│   └── payment.js
│
├── login/
│   ├── log.html
│   └── login.css
│
├── profile/
│   ├── profile.html
│   ├── profile.css
│   └── profile.js
│
├── img/
│
└── README.md
```

## Functionality

### Products

Users can:
- search for products
- filter products by category
- open product details
- save products to favorites

Saved products are stored in localStorage.

### Saved

Users can:
- view saved products
- remove products from saved items
- sort products by name or price
- select a product and continue to Booking

### Booking

The Booking page reads cart data from localStorage.

Users can:
- view selected products
- change quantity
- remove items
- view the total price
- continue to payment

### Profile

The Profile page displays:
- user information
- number of saved items
- number of cart items
- account details
- order history

Profile information can also be stored using localStorage.

## Responsive Design

The website supports:

- Desktop
- Tablet
- Mobile

Responsive design is implemented using Bootstrap and CSS media queries.

## Authors

SE-2527:

- Anel Melis
- Albina Onglassyn
- Aziza Kenzhegali

## Deployment

The project is published using GitHub Pages.

Live Website: https://anelmelis.github.io/minedrop-midka/home/main.html
