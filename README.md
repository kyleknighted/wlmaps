# Woodland Lakes Map

## Project Overview
The Woodland Lakes Map is a mobile-friendly, browser-based application designed for the Woodland Lakes gated community. It provides an interactive map experience without standard addresses, allowing users to navigate using an internal addressing system based on Lot, Block, and Section.

## Features
- Full-screen interactive map using Leaflet.js
- Static PNG overlay map for visual reference
- GPS marker support for internal property addressing
- Search functionality to find properties by Lot, Block, and Section
- Display of the user's current GPS location (with permission)
- Custom markers for special locations (e.g., Office, Community Center)
- Responsive design for mobile-friendly usage

## Project Structure
```
woodland-lakes-map
├── src
│   ├── components
│   │   └── Map.tsx          # Main map component
│   ├── data
│   │   └── markers.ts       # Marker data
│   ├── pages
│   │   └── index.tsx        # Main entry point
│   ├── styles
│   │   └── Map.module.css    # Styles for the Map component
│   └── types
│       └── marker.ts        # TypeScript interface for markers
├── public
│   └── map.png              # Static PNG overlay image
├── package.json              # npm configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd woodland-lakes-map
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage
- Use the search input to find properties by entering the internal address format (e.g., "Lot 5, Block C, Section 2").
- Allow the application to access your location to see your current GPS position on the map.
- Explore the map and interact with the markers representing different properties and special locations.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.