import {AdaptivityProvider, AppRoot, ConfigProvider} from "@vkontakte/vkui";
import {useScreenType} from "./hooks";
import {RouterProvider} from "@vkontakte/vk-mini-apps-router";
import {App} from "./App";
import {router} from "./routes";
import {NotFoundPanel} from "./panels/NotFoundPanel/NotFoundPanel";

export const AppConfig = () => {
  const screenType = useScreenType();

  return (
    <ConfigProvider
      platform={screenType === 'desktop' ? 'vkcom' : undefined}
    >
      <AdaptivityProvider>
        <AppRoot mode={"full"} layout={'card'}>
          <RouterProvider router={router} notFound={<NotFoundPanel/>}>
            <App />
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  )
}