import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";
import { Provider } from "react-redux";

import store from "../../single-spa-redux/src/shared/sharedStore";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: () => (
    <Provider store={store}>
      <Root />
    </Provider>
  ),
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
