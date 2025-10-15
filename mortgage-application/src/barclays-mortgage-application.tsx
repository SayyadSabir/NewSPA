import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    console.error("Error in Mortgage Application MFE:", err, info);
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h2>Something went wrong with the Mortgage Application</h2>
        <p>
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
      </div>
    );
  },
});

// Export the lifecycles for single-spa to mount the application
// The application will be mounted when the route matches /secure/launch/financialdetails
export const { bootstrap, mount, unmount } = lifecycles;
