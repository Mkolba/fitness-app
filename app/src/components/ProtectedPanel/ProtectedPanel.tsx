import React, {useEffect} from "react";
import {Panel, PanelProps, Placeholder} from "@vkontakte/vkui";
import {useUserType} from "../../hooks";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export interface ProtectedPanelProps extends PanelProps {
  redirectTo: string
}

export const ProtectedPanel: React.FC<ProtectedPanelProps> = ({
  children,
  redirectTo,
  nav,
  ...restProps
}) => {
  const userType = useUserType();
  const router = useRouteNavigator();

  useEffect(() => {
    if (userType !== 'admin') {
      setTimeout(() => router.replace(redirectTo), 600);
    }
  }, [userType])

  return (
    <Panel nav={nav} {...restProps}>
      {userType === 'admin' ?
        children
        :
        null
      }
    </Panel>
  )
}