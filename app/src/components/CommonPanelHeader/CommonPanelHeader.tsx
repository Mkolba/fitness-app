import React from "react";
import {PanelHeader, PanelHeaderBack, PanelHeaderProps} from "@vkontakte/vkui";
import {useFirstPageCheck, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

import './CustomPanelHeader.scss';

export const CustomPanelHeader: React.FC<PanelHeaderProps> = ({
  children,
  ...restProps
}) => {
  const isFirstPage = useFirstPageCheck();
  const router = useRouteNavigator();

  return (
    <PanelHeader before={<PanelHeaderBack onClick={() => isFirstPage ? router.push('/') : router.back()} />} {...restProps}>
      {children}
    </PanelHeader>
  )
}