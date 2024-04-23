import React, {useEffect, useState} from 'react';
import {SplitCol, SplitLayout, View} from "@vkontakte/vkui";
import {useActiveVkuiLocation, useGetPanelForView, usePopout, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {RootEpic} from "./components";
import {
  AdminCreatePanel,
  AdminPanel, AdminsPanel,
  ClientCreatePanel,
  ClientPanel,
  ClientsPanel,
  LoginPanel,
  TrainerCreatePanel,
  TrainerPanel,
  TrainersPanel, WorkoutCreatePanel,
  WorkoutsPanel, WorkoutTypeCreatePanel, WorkoutTypePanel, WorkoutTypesPanel
} from "./panels";
import {DEFAULT_VIEW} from "./routes";
import {WorkoutPanel} from "./panels/WorkoutPanel/WorkoutPanel";
import {useUserType} from "./hooks";
import {api} from "./api";

export const App: React.FC = () => {
  const router = useRouteNavigator();

  const [userId, setUserId] = useState<number>(api.getToken().payload.UserID)
  const { view: activeView } = useActiveVkuiLocation();
  const activePanel = useGetPanelForView(activeView || DEFAULT_VIEW) || ''

  const popout = usePopout();
  const userType = useUserType();

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (userType === "not_authorized") {
      router.replace('/login')
    } else {
      setUserId(api.getToken().payload.UserID)
    }
  }, [userType])

  return (
    <SplitLayout popout={popout}>
      <SplitCol width={'100%'} stretchedOnMobile animate>
        <RootEpic showTabbar={['admin', 'sudo'].includes(userType)}>
          <View nav={'login'} activePanel={activePanel}>
            <LoginPanel nav={'login'}/>
          </View>
          <View nav={'admins'} activePanel={activePanel}>
            <AdminsPanel nav={'admins'} redirectTo={userType === 'trainer' ? `/trainer/${userId}` : '/'} allowedRoles={['sudo']}/>
            <AdminPanel nav={'admin'} redirectTo={userType === 'trainer' ? `/trainer/${userId}` : '/'} allowedRoles={['sudo']}/>
            <AdminCreatePanel nav={'adminCreate'} redirectTo={userType === 'trainer' ? `/trainer/${userId}` : '/'} allowedRoles={['sudo']}/>
          </View>
          <View nav={'workouts'} activePanel={activePanel}>
            <WorkoutsPanel nav={'workouts'} redirectTo={`/trainer/${userId}`}/>
            <WorkoutPanel nav={'workout'}/>
            <WorkoutCreatePanel nav={'workoutCreate'} redirectTo={`/trainer/${userId}`}/>
          </View>
          <View nav={'trainers'} activePanel={activePanel}>
            <TrainersPanel nav={'trainers'} redirectTo={`/trainer/${userId}`}/>
            <TrainerPanel nav={'trainer'}/>
            <TrainerCreatePanel nav={'trainerCreate'} redirectTo={userType === 'trainer' ? `/trainer/${userId}` : '/'} allowedRoles={['sudo']}/>
          </View>
          <View nav={'clients'} activePanel={activePanel}>
            <ClientsPanel nav={'clients'} redirectTo={`/trainer/${userId}`}/>
            <ClientPanel nav={'client'} redirectTo={`/trainer/${userId}`}/>
            <ClientCreatePanel nav={'clientCreate'} redirectTo={`/trainer/${userId}`}/>
          </View>
          <View nav={'workoutTypes'} activePanel={activePanel}>
            <WorkoutTypesPanel nav={'workoutTypes'} redirectTo={`/trainer/${userId}`}/>
            <WorkoutTypePanel nav={'workoutType'} redirectTo={`/trainer/${userId}`}/>
            <WorkoutTypeCreatePanel nav={'workoutTypeCreate'} redirectTo={`/trainer/${userId}`}/>
          </View>
        </RootEpic>
      </SplitCol>
    </SplitLayout>
  )
}
