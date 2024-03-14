import React, {ReactElement} from "react";
import {Epic, Tabbar, TabbarItem} from "@vkontakte/vkui";
import {
  Icon24MessageOutline,
  Icon24UserCircleOutline
} from "@vkontakte/icons";

import {useActiveVkuiLocation, useGetPanelForView, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW} from "../../routes";

interface RootEpicProps {
  children: ReactElement[]
}

export const RootEpic: React.FC<RootEpicProps> = ({
  children
}) => {
  let { view: activeView } = useActiveVkuiLocation();
  const router = useRouteNavigator();

  return (
    <Epic activeStory={activeView || DEFAULT_VIEW} tabbar={ activeView !== 'login' &&
      <Tabbar>
        <TabbarItem onClick={() => router.push('/')} text={'Мессенджер'} selected={activeView === 'chat'}>
          <Icon24MessageOutline/>
        </TabbarItem>
        <TabbarItem onClick={() => router.push('/profile')} text={'Профиль'} selected={activeView === 'profile'}>
          <Icon24UserCircleOutline/>
        </TabbarItem>
      </Tabbar>
    }>
      {children}
    </Epic>
  )
}