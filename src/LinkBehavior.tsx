import * as React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from "react-router-dom";

const LinkBehavior = React.forwardRef<any, Omit<RouterLinkProps, "to">>(
  (props, ref) => (
    <RouterLink ref={ref} to="/getting-started/installation/" {...props} />
  )
);
