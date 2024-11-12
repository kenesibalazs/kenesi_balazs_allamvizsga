## Államvizsga dolgozat
## Automatic attendance tracking in didactical environment

# Occasion API Endpoints

## Table of Contents
- [Get Occasion by Group ID](#get-occasion-by-group-id)
- [Fetch Occasions by IDs](#fetch-occasions-by-ids)
- [Get Occasion by Subject ID](#get-occasion-by-subject-id)
- [Add Comment to Existing Occasion](#add-comment-to-existing-occasion)
- [Get Occasions Excluding Time Periods](#get-occasions-excluding-time-periods)

---


## Fetch Occasions by IDs
Fetch a list of occasions based on an array of occasion IDs.

- **URL:** `/occasions/ids`
- **Method:** `POST`
- **Body:** 
  - JSON array of occasion IDs, e.g., `{ "ids": ["id1", "id2", "id3"] }`
- **Response:** `200 OK` with a JSON array of occasions matching the provided IDs.


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

The occasions data originates from [EduPage](https://sapientia-emte.edupage.org/timetable/), ensuring that the timetable stays consistent with institutional schedules.

