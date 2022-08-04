import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Dashboard from "./Dashboard";

const Rootstack = createAppContainer(
  createSwitchNavigator(
    {
      Dashboard: Dashboard,
    },
    {
      headerMode: "none",
      initialRouteName: "Dashboard",
    }
  )
);

export default Rootstack;
