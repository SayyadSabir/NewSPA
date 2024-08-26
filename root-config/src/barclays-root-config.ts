import { registerApplication, start, LifeCycles } from "single-spa";

// registerApplication({
//   name: "@single-spa/welcome",
//   app: () =>
//     System.import<LifeCycles>(
//       "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
//     ),
//   activeWhen: ["/"],
// });

registerApplication({
  name: "@barclays/mortgage-application",
  app: () => System.import<LifeCycles>("@barclays/mortgage-application"),
  activeWhen: (location) => location.pathname === "/",
});

registerApplication({
  name: "@barclays/your-details",
  app: () => System.import<LifeCycles>("@barclays/your-details"),
  activeWhen: (location) => location.pathname === "/your-details",
});

registerApplication({
  name: "@barclays/client-details",
  app: () => System.import<LifeCycles>("@barclays/client-details"),
  activeWhen: (location) => location.pathname === "/client-details",
});

registerApplication({
  name: "@barclays/barclays-mortgage",
  app: () => System.import<LifeCycles>("@barclays/barclays-mortgage"),
  activeWhen: (location) => location.pathname === "/barclays-mortgage",
});

// registerApplication({
//   name: "@barclays/navbar",
//   app: () => System.import("@barclays/navbar"),
//   activeWhen: ["/"]
// });

start({
  urlRerouteOnly: true,
});
