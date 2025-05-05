This project was made to learn how to deploy a frontend and backend (monolithic project) on AWS EC2.
The frontend of this project is [here](https://github.com/applepiofmyeye/inspection-report), and has more information about the project.

## Express Server for API Calls -- Inspection Report

- Made with SQLite, Sequelize, Node.js Express,
- Hosted on AWS EC2 Instance, using NGINX

## Database Schema

![Database Schema](https://github.com/applepiofmyeye/inspection-report/blob/main/database-schema.drawio.png)

Note: the criteria table is seeded with the data from the frontend, with this data: [checklist.ts](https://github.com/applepiofmyeye/inspection-report/blob/main/src/constants/checklist.ts)

## Deployment

<details>
  <summary><b>AWS EC2 Instance Deployment Steps</b></summary>

### AWS EC2 Instance

- Launch EC2 Instance
- Configure Security Group
  - Add Rule: HTTP (80)
  - Add Rule: HTTPS (443)
- Configure Instance Details (AMI, Instance Type, Key Pair)
- Create IAM Role to access EC2 Instance
  - Create IAM Role
  - Attach Policy to IAM Role
- Access EC2 Instance through SSH

### NGINX

- Install NGINX
  - `sudo apt-get install nginx`
- Configure NGINX

  - Create a new NGINX configuration file
    - `sudo vim /etc/nginx/sites-available/default`
  - Add the following configuration to the file

    ```
    server {
        listen 80;
        listen [::]:80;

        server_name localhost;

        location / {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

  - Enable the new configuration
    - `sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default`
  - Restart NGINX
    - `sudo systemctl restart nginx`

### Node.js

- Install Node.js
  - `sudo apt-get install nodejs`
- Install NPM
  - `sudo apt-get install npm`
- Install Express
  - `sudo npm install express`
- Install Sequelize
  - `sudo npm install sequelize`
- Install Cors
  - `sudo npm install cors`

### Database

- Install SQLite
  - `sudo apt-get install sqlite3`
- Create Database
  - `sqlite3 database.sqlite`
  - Create Tables
    - `CREATE TABLE car (id TEXT PRIMARY KEY, brand TEXT, model TEXT, year INTEGER, mileage INTEGER);`
    - `CREATE TABLE inspection (id TEXT PRIMARY KEY, car TEXT, date TEXT, location TEXT, status TEXT);`
    - `CREATE TABLE criteria (id TEXT PRIMARY KEY, name TEXT);`
    - `CREATE TABLE criteria_by_inspection (id TEXT PRIMARY KEY, inspectionId TEXT, criteriaId TEXT, score REAL, notes TEXT);`

### Express Server

- Create Express Server
  - `sudo nano index.js`
  - Add `index.js` file to the directory

## Usage

- Start Server
  - `node index.js`

</details>

<details open>
  <summary><b>Local Development Steps</b></summary>

### From this Repo

Prerequisites:

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

1. Clone this repo

```bash
git clone https://github.com/applepiofmyeye/express-server-inspection-report.git
```

2. Navigate to the repo directory

```bash
cd express-server-inspection-report
```

3. Install dependencies

```bash
pnpm install
```

4. Start server

```bash
pnpm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the endpoint.

</details>
