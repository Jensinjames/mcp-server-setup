# MCP Admin Console and Dashboards

This document provides information about the MCP Admin Console and Dashboards, a web-based interface for managing the Model Context Protocol (MCP) server.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dashboard](#dashboard)
- [Models Management](#models-management)
- [Users Management](#users-management)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

The MCP Admin Console is a web-based interface that provides a user-friendly way to manage and monitor the MCP server. It includes dashboards for visualizing data, tools for managing models and users, and various administrative functions.

## Features

- **Dashboard**: View key metrics and statistics about models, users, and system performance
- **Models Management**: Add, view, edit, and delete models
- **Users Management**: Manage user accounts and permissions
- **Data Visualization**: Charts and graphs for data analysis
- **Export Functionality**: Export data to CSV format
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure login and role-based access control

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (if using MongoDB adapter)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy the example environment file and modify as needed:

```bash
cp env-example.txt .env
```

Add the following variables to your `.env` file:

```
# Admin Console Configuration
ADMIN_PORT=3001
SESSION_SECRET=your-secure-session-secret
DASHBOARD_CACHE_TTL=300
```

3. Build the project:

```bash
npm run build
```

## Usage

### Starting the Admin Console

To start the web-based admin console:

```bash
npm run admin:web
```

This will start the admin console on the port specified in your `.env` file (default: 3001).

### Accessing the Admin Console

Open your browser and navigate to:

```
http://localhost:3001
```

### Default Credentials

- **Admin User**: username: `admin`, password: `admin123`
- **Regular User**: username: `user`, password: `user123`

**Important**: Change these default passwords in production!

## Dashboard

The dashboard provides an overview of your MCP server with the following sections:

- **Models Statistics**: Total models, new models, total parameters, etc.
- **Users Statistics**: Total users, user roles, active users, etc.
- **System Statistics**: CPU usage, memory usage, uptime, database size, etc.
- **Charts**: Visual representation of models by provider and users by role
- **Recent Activity**: Lists of recently added models and users

### Refreshing Dashboard Data

Click the "Refresh Data" button to update the dashboard with the latest information.

## Models Management

### Viewing Models

The Models page displays a list of all models with the following information:
- ID
- Name
- Provider
- Parameters
- Creation date
- Last update date

### Filtering and Searching

- Use the search box to find models by name
- Use the provider filter to show only models from a specific provider

### Adding a Model

1. Click the "Add Model" button
2. Fill in the required fields:
   - Name
   - Provider
   - Parameters
3. Optionally add metadata in JSON format
4. Click "Add Model" to save

### Editing a Model

1. Click the edit icon next to a model
2. Modify the fields as needed
3. Click "Update Model" to save changes

### Deleting a Model

1. Click the delete icon next to a model
2. Confirm the deletion on the confirmation page

### Exporting Models

Click the "Export to CSV" button to download a CSV file containing the model data.

## Users Management

### Viewing Users

The Users page displays a list of all users with the following information:
- ID
- Username
- Role
- Creation date
- Last update date

### Filtering and Searching

- Use the search box to find users by username
- Use the role filter to show only users with a specific role

### Adding a User

1. Click the "Add User" button
2. Fill in the required fields:
   - Username
   - Password
   - Confirm Password
   - Role
3. Click "Add User" to save

### Editing a User

1. Click the edit icon next to a user
2. Modify the fields as needed
3. Click "Update User" to save changes

### Deleting a User

1. Click the delete icon next to a user
2. Confirm the deletion in the confirmation dialog

### Exporting Users

Click the "Export to CSV" button to download a CSV file containing the user data.

## API Endpoints

The admin console provides the following API endpoints:

### Dashboard Data

```
GET /api/dashboard
```

Query parameters:
- `refresh`: Set to `true` to force a refresh of cached data

### Models Data

```
GET /api/models
```

### Users Data

```
GET /api/users
```

## Configuration

The admin console can be configured using the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_PORT` | Port for the admin console | `3001` |
| `SESSION_SECRET` | Secret for session encryption | `mcp-admin-secret-change-in-production` |
| `DASHBOARD_CACHE_TTL` | Cache time-to-live in seconds | `300` (5 minutes) |
| `DB_TYPE` | Database type (`memory` or `mongodb`) | `memory` |
| `DB_URL` | MongoDB connection URL | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `mcp` |

## Troubleshooting

### Common Issues

#### Cannot connect to the admin console

- Ensure the admin console is running (`npm run admin:web`)
- Check that the port is not in use by another application
- Verify network settings and firewall rules

#### Login issues

- Ensure you're using the correct credentials
- Check that the database is properly initialized
- Try resetting the password using the database setup script

#### Dashboard data not updating

- Click the "Refresh Data" button
- Check the server logs for any errors
- Verify database connectivity

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the server logs for error messages
2. Consult the MCP server documentation
3. Open an issue in the GitHub repository

---

© 2023 Model Context Protocol Admin Console
