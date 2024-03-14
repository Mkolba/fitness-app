import React from 'react';
import {SplitCol, SplitLayout, View} from "@vkontakte/vkui";
import {useActiveVkuiLocation, useGetPanelForView} from "@vkontakte/vk-mini-apps-router";
import {useAtomValue} from "@mntm/precoil";
import {RootEpic} from "./components";
import {popoutAtom} from "./store";
import {DEFAULT_VIEW} from "./routes";

export const App: React.FC = () => {
  let { view: activeView } = useActiveVkuiLocation();
  const activePanel = useGetPanelForView(activeView || DEFAULT_VIEW) || '';
  const popout = useAtomValue(popoutAtom);

  return (
    <SplitLayout popout={popout}>
      <SplitCol width={'100%'} stretchedOnMobile>
        <RootEpic>
          <View nav={'login'} activePanel={activePanel}>

          </View>
          <View nav={'chat'} activePanel={activePanel}>

          </View>
          <View nav={'profile'} activePanel={activePanel}>

          </View>
        </RootEpic>
      </SplitCol>
    </SplitLayout>
  )
}
