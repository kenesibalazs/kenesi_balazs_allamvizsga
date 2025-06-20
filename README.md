## Államvizsga dolgozat
# Automatic attendance tracking in didactical environment

## Abstract

The topic of my thesis is an automatic attendance recording system in an educational environment. Attendance recording plays an important role in educational systems, as it allows teachers to track whether individual students have fulfilled their mandatory class attendance requirements. In the current system, attendance is usually recorded in writing or by roll call, which is time-consuming and prone to cheating. The aim of my thesis is to provide a solution to this problem by digitizing the current system, speeding it up, and minimizing the possibility of cheating. 

My system consists of three main components: a mobile application, a website, and a smart device that uses NFC technology. Students identify themselves with their mobile phones at the smart device, which initiates an authentication process. Teachers can access attendance data in the web application, where they can manage, filter, and download it. 

The aim of the process is to make it difficult for students to falsify their own attendance by integrating the smart device. Taking into account various attack methods, the system's design makes the most common methods of falsifying attendance impossible.

My digitized and automated system minimizes the possibility of attendance fraud and offers a more transparent and unified solution for teachers to manage attendance data. The modern technologies used in the development ensure the scalability, maintainability, and ease of use of the system for both students and teachers.



- A **Node.js backend** with MongoDB database
- A **web interface** for administrators and teachers to manage attendance and timetables
- A **mobile app** for students to join the attendance, with NFC and ECC technologies
- A **Raspberry Pi NFC kiosk** for physical check-ins, ensuring in-person validation and preventing fraud

## Backend – Technologies

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens)
- REST API


### Main Responsibilities
- Handles user authentication (Neptun login & JWT-based auth)
- Manages university data, timetable, occasions, and attendance
- Serves API endpoints consumed by both the web and mobile apps
- Provides NFC-related codes for Raspberry Pi devices


### Key API Endpoints

- `POST /signup-neptun` – Register using Neptun code
- `POST /login` – Standard login with token generation
- `GET /occasions/:userId` – Get timetable occasions for user
- `GET /periods` – Retrieve period information (start/end times)
- `GET /attendance/nfc/:readerId` – Fetch current NFC attendance code
- `POST /vote/:userId/:votingId/:candidateId` – Vote endpoint (if voting module included)


# Register with Neptun

This module enables users to register using their Neptun account credentials. By connecting to the Neptun system, the application retrieves user information, allowing them to access the application with their existing Neptun data.

![Register with Neptun Screenshot](assets/register-with-neptun.png)

## Implementation Process

This section outlines the steps taken to integrate Neptun-based registration, including the client and server-side components and communication with external systems.

### Client-Side (Frontend)

- **React Components**:
  - ✔ **Form Design**: A form created with Ant Design components, including fields for university selection, Neptun code, and password.
  - ✔ **Tooltips for Guidance**: Tooltips were added to explain the Neptun Code field, using Ant Design’s `Tooltip` component.

- **API Integration**:
  - ✔ `signupUserWithNeptun` function makes an API call to initiate registration.

### Server-Side (Backend)

- **Endpoints**:
  - ✔ **/signup-neptun**: The backend endpoint `/signup-neptun` validates the user credentials with Neptun and generates a JWT for successful registrations.
  - ✔ **Error Handling**: Returns specific error messages for incorrect Neptun credentials or missing fields.
  - ✔ **Enhanced Logging**: Add more detailed logging for failed registration attempts.

- **Data Flow**:
  - ✔ **Validation**: Checks if the user exists in the database using Neptun credentials.
  - ✔ **JWT Generation**: Generates a JWT token with essential user data upon successful authentication.
  - ✔ **University and Type Data**:  Retrieve and save actual `universityId` and `type` information from Neptun where available.

### APIs Utilized

1. **Neptun Login API**:
   - **Purpose**: Authenticates with Neptun credentials to retrieve user details.
   - **Endpoint**: `https://host.sdakft.hu/semtehw/login.aspx`
   - ✔ **Authentication**: Uses the Neptun code and password to initiate a login and retrieve user data from Neptun.
   - ✔ **Fetch Additional Details**: Retrieve other personal data fields from Neptun if available.

2. **Application Signup Endpoint**:
   - **Purpose**: Registers a new user with Neptun credentials by checking for an existing Neptun code and matching password.
   - **Endpoint**: `/signup-neptun`
   - **Method**: `POST`
   - **Request Body**:
     - **neptunCode**: The user’s Neptun code
     - **password**: User’s password for Neptun
     - **universityId**: The user's university Id

This setup provides a thorough overview of how the `Register with Neptun` functionality was implemented, alongside the tasks that remain to be completed for a robust and user-friendly registration experience.




# Web Timetable WeekView

This module provides a comprehensive timetable view for the week, tailored to students and teachers with dynamic scheduling, commenting, and customization options.

### Screenshot

![Timetable Screenshot](assets/web-timetable-weekview.png)

## Key Features

- **Timetable Viewing Options**:
  - ✔ **Weekly View**: Displays a full week’s timetable, including all scheduled occasions.
  - ✘ **Daily View**: Allows users to focus on a specific day's schedule. 
  - ✔ **Monthly View**: Allows users to view a specific month's schedule.  
  - ✘ **Customizable for Each Student**: Students can personalize their timetable with their own unique occasions.

- **Student Timetable Customization**:
  - ✘ **Add Occasions**: Students can add new occasions to customize their schedule.
  - ✘ **Remove Occasions**: Students can delete occasions to keep their timetable current.

- **Teacher Features**:
  - ✔ **Add and Edit Comments**: Teachers can attach comments to occasions to provide context or updates.
  - ✔ **Comment Types**:
    - **COMMENT** (default): Standard note or information about the occasion.
    - **TEST**: Indicates a test or exam for the occasion, alerting the student.
    - **FREE**: Indicates that the class will not be held.

- **Student Comment Viewing**:
  - ✔ **View Comments**: Students can view any comments teachers add to their occasions, keeping them informed of important notes or updates.

## API Integrations

The timetable relies on two APIs, `useOccasions` and `usePeriod`, to dynamically fetch and display scheduling data.

### useOccasions API

Fetches specific occasions based on IDs, allowing for targeted retrieval of a student's schedule.

- **fetchOccasionsByIds**
  - **Endpoint**: `/occasions/ids`
  - **Method**: `POST`
  - **Request Body**: JSON array of occasion IDs, e.g., `{ "ids": ["id1", "id2", "id3"] }`
  - **Response**: Returns a JSON array of occasions that match the provided IDs.

### usePeriod API

Retrieves period data, providing the times associated with each schedule slot.

- **getPeriods**
  - **Endpoint**: `/periods`
  - **Method**: `GET`
  - **Response**: Returns a JSON array of periods.

## Data Source


