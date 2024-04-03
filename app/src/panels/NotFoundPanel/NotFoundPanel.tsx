import React from "react";
import {
  AdaptivityProvider,
  AppRoot,
  Panel,
  PanelProps,
  Placeholder,
  SplitCol,
  SplitLayout,
  View
} from "@vkontakte/vkui";
import './style.scss';
import {Icon56RudeMessageOutline} from "@vkontakte/icons";

export const NotFoundPanel: React.FC<PanelProps> = ({
  nav='notFound'
}) => {
  return (
    <AdaptivityProvider>
      <AppRoot>
        <SplitLayout>
          <SplitCol width={'100%'}>
            <View nav={nav} activePanel={nav}>
              <Panel nav={nav}>
                <Placeholder
                  stretched
                  header={'Ничегошеньки!'}
                  icon={<Icon56RudeMessageOutline width={70} height={70} fill={'rgb(0, 140, 255)'}/>}
                />
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </AdaptivityProvider>
  )
}