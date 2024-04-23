import React, {useLayoutEffect} from "react";
import {Panel, PanelProps} from "@vkontakte/vkui";
import {useUserType} from "../../hooks";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {UserType} from "../../types";

export interface ProtectedPanelProps extends PanelProps {
  redirectTo: string,
  allowedRoles?: UserType[]
}

export const ProtectedPanel: React.FC<ProtectedPanelProps> = ({
  children,
  redirectTo,
  nav,
  allowedRoles=['admin', 'sudo'],
  ...restProps
}) => {
  const userType = useUserType();
  const router = useRouteNavigator();

  useLayoutEffect(() => {
    if (!allowedRoles.includes(userType)) {
      setTimeout(() => router.replace(redirectTo), 600);
    }
  }, [userType])

  return (
    <Panel nav={nav} {...restProps}>
      {allowedRoles.includes(userType) ?
        children
        :
        null
      }
    </Panel>
  )
}