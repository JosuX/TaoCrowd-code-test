# JS Code Test

This code test will determine your approach on solving problems.

You will be using SpaceX API. <https://docs.spacexdata.com>

Your app should only utilize `https://api.spacexdata.com/v3/launches` endpoint.

---

What the app should do:

- Display a loading component.
- Fetch data from the provided api.
- Apply infinite scrolling.
- Display fetched data in a scrollable view that lazy loads more data when scrolled down.
- Display loading component at the bottom of the list on every lazy load.
- Show message when no more data fetched.
- Integrate basic search feature.

---

## Important

- The above features will be the whole basis of your evaluation. If you were able to finish everything, you can then add more features to the application.
- Implement your own infinite scroll feature.

### Notes

- Feel free to show off more of your skillset. You can use state management libraries, react-router and other libraries that you are comfortable using.
- You can add different transitions.

### Note from Jofer

In my implementation, I modified the file structure and updated the framework. Since the Create React App is deprecated and old, and many of the initial packages for react-scripts are incompatible with the latest version of React, I opted to build the project using Next.js, a React framework.

To run in Development mode:
```npm run dev```

To build the application:
```npm run build```

To build and start the application:
```npm run```
