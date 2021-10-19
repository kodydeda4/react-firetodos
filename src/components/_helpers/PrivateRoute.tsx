import { Redirect, Route, RouteProps } from "react-router-dom";
import ROUTES from "../../routes";
import { storeHooks } from "../../store";

interface PrivateRouteProps extends RouteProps {
  component?: any;
  children?: any;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const { component: Component, children, ...rest } = props;
  const user = storeHooks.useStoreState((state) => state.authModel.user);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        user ? (
          Component ? (
            <Component {...routeProps} />
          ) : (
            children
          )
        ) : (
          <Redirect
            to={{
              pathname: ROUTES.login,
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
}
