import React, {ReactElement} from "react";
import {Epic, Tabbar, TabbarItem} from "@vkontakte/vkui";
import {
  Icon24FolderSimpleUserOutline,
  Icon24UsersOutline, Icon28DumbbellsOutline, Icon28FavoriteOutline, Icon28ListOutline
} from "@vkontakte/icons";

import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {DEFAULT_VIEW} from "../../routes";
import {useUserType} from "../../hooks";

interface RootEpicProps {
  children: ReactElement[],
  showTabbar?: boolean
}

export const RootEpic: React.FC<RootEpicProps> = ({
  showTabbar=true,
  children
}) => {
  let { view: activeView } = useActiveVkuiLocation();
  const router = useRouteNavigator();
  const userType = useUserType();

  return (
    <Epic activeStory={activeView || DEFAULT_VIEW} tabbar={ (showTabbar && activeView !== 'login') &&
      <Tabbar>
        {userType === 'sudo' &&
          <TabbarItem onClick={() => router.push('/admins')} text={'Админы'} selected={activeView === 'admins'}>
            <Icon28FavoriteOutline width={24} height={24}/>
          </TabbarItem>
        }
        <TabbarItem onClick={() => router.push('/workoutTypes')} text={'Типы тренировок'} selected={activeView === 'workoutTypes'}>
          <Icon28ListOutline width={24} height={24}/>
        </TabbarItem>
        <TabbarItem onClick={() => router.push('/')} text={'Тренировки'} selected={activeView === 'workouts'}>
          <Icon28DumbbellsOutline width={24} height={24}/>
        </TabbarItem>
        <TabbarItem onClick={() => router.push('/trainers')} text={'Тренеры'} selected={activeView === 'trainers'}>
          <Icon24UsersOutline/>
        </TabbarItem>
        <TabbarItem onClick={() => router.push('/clients')} text={'Клиенты'} selected={activeView === 'clients'}>
          <Icon24FolderSimpleUserOutline/>
        </TabbarItem>
      </Tabbar>
    }>
      {children}
    </Epic>
  )
}