import React from "react";
import {PanelHeader, PanelHeaderBack, PanelHeaderProps} from "@vkontakte/vkui";
import {useFirstPageCheck, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

import './style.scss';

interface CommonPanelHeaderProps extends PanelHeaderProps {
  root?: boolean
}

export const CommonPanelHeader: React.FC<CommonPanelHeaderProps> = ({
  children,
  root=false,
  ...restProps
}) => {
  const isFirstPage = useFirstPageCheck();
  const router = useRouteNavigator();

  return (
    <PanelHeader before={!root && <PanelHeaderBack onClick={() => isFirstPage ? router.push('/') : router.back()} />} {...restProps}>
      {children}
    </PanelHeader>
  )
}