# User-repo-filterer

## Description

This project is a simple application built with React and TypeScript. It uses the GitHub GraphQL API to fetch and display user avatar URLs and repository information including the name, URL, and description. Users can filter the repositories of the given user by language or search term.

## How to Run

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies with `npm install`.
4. Start the application with `npm start`.

The application will start running on `http://localhost:3000` in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## How to Run the Test Suite

To run the test suite, navigate to the project directory and run 
### `npm test`.

## Future Improvements

- Break up App component into smaller components to improve readability e.g. SearchBar, NavBar, UserCard, RepoList
- Break up CSS elements 
- Include working links in the navbar 
- Improve UI/UX by including things like hover effects
- Include tests 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
