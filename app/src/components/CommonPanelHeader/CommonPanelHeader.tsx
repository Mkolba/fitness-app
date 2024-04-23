import React from "react";
import {PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelHeaderProps} from "@vkontakte/vkui";
import {useFirstPageCheck, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

import './style.scss';
import {Icon24DoorArrowRightOutline} from "@vkontakte/icons";

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
    <PanelHeader
      before={!root && <PanelHeaderBack onClick={() => isFirstPage ? router.push('/') : router.back()} />}
      after={ root &&
        <PanelHeaderButton onClick={() => {
          localStorage.removeItem('jwt-access-token');
          router.replace('/login');
        }}>
          <Icon24DoorArrowRightOutline color={'var(--vkui--color_background_negative)'}/>
        </PanelHeaderButton>
      }
      {...restProps}
    >
      {children}
    </PanelHeader>
  )
}