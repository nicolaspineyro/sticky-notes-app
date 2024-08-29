# Sticky Notes App

Welcome to the Sticky Notes App repository! This project is a solution to the challenge of building a Sticky Notes App, where the user can create, edit, and delete notes.

![sticky-notes](https://github.com/user-attachments/assets/fa3ba377-0f57-4965-8e82-c9163cfb0577)

### Overview And Solution

In this challenge the functional requirements are the following:
```
 1 - The user must be able to create  a note of the specified size at the specified position.
 2 - Change note size by dragging.
 3 - Move a note by dragging.
 4 - Remove a note by dragging it over a predefined "trash zone".
```
 
Bonus: 
```
 I - Entering/editing note text.
 II - Moving notes to the front.
 III - Saving notes to local storage.
 IV - Different note colors.
 V - Savig notes to mocked REST API.
```

The architecture of the app components is the following:
```
* App
   - NotesContext
      - NotesBoard
            - Notes Action Buttons
            - WhiteBoard
               - Note
```

First of all, to solve this challenge the stack chosen consists of Typescript, CSS, and React built with Vite, this is going to be an SPA closed to the user we don't need any SSR as we won't get too many advantages from it. The approach was to keep it simple and concentrate on the components and performance.
For the pattern, I choose to build custom hooks to encapsulate the business logic from presentation components and core functionalities. I choose context to provide actions in various levels deep into the component tree, if in the future we want to add more boards or components to the whiteboard we can extend functionalities easier and more organized.

These are the custom hooks built:

  - useDragAndStick: Contains the logic necessary for dragging an HTML element within given boundaries, and returns the styles and callback methods, if in the future we want this dragging functionality for other HTML elements we can do it easily. This also could be tackled using the HOC pattern.
  - useResize: Similar to useDragAndStick, contains the logic necessary for resizing an HTML element by dragging.
  - useNotes: Contains the business logic necessary for adding, deleting, and editing a note, is a deeper level of abstraction to not consume the context directly, and separates the responsibilities accordingly. Is handy to consume it whenever we want inside the Notes Context.
  - useNoteContext: little abstraction to consume directly the context if needed.
  - useNote: this is an encapsulation of the business logic for the ```Note``` component, helps separates the presentation from business.

Context: 
  NoteContext: For better organization events and state management I used useReducer. So in the future want to track user actions we can do it easily.

### Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/nicolaspineyro/sticky-notes-app

2. Navigate to the Project Directory and Install dependencies:

   ```bash
   cd sticky-notes-app
   yarn install

3. Run the project
   ```bashÏ
   cd sticky-notes-app
   yarn dev
