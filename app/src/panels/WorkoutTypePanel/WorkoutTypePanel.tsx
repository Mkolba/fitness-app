import {
  CardGrid,
  Group,
  Header,
  Link,
  Panel,
  PanelHeaderButton,
  PanelProps,
  Placeholder,
  Spinner
} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkoutType, IWorkout} from "../../types";
import {api} from "../../api";
import {WorkoutTypeInfoBlock} from "../../components/";
import {WorkoutCard} from "../../components/WorkoutCard/WorkoutCard";
import {useUserType} from "../../hooks";
import {Icon24DoorArrowRightOutline} from "@vkontakte/icons";

export const WorkoutTypePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {

  // @ts-ignore
  const {id: workoutTypeId} = useParams()
  const [workoutType, setWorkoutType] = useState<IWorkoutType | null>(null);
  const userType = useUserType();
  const router = useRouteNavigator();

  useEffect(() => {
    if (workoutTypeId) {
      api.getWorkoutType(Number(workoutTypeId)).then(data => {
        setWorkoutType(data)
      }).catch(() => {})
    }
  }, [workoutTypeId])

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      {workoutType ?
        <>
          <CommonPanelHeader>
            Тип тренировки
          </CommonPanelHeader>

          <WorkoutTypeInfoBlock workoutType={workoutType} editable/>

        </>
        :
        <>
          <CommonPanelHeader>
            Загрузка...
          </CommonPanelHeader>
          <Group>
            <Placeholder icon={<Spinner/>}/>
          </Group>
        </>
      }
    </ProtectedPanel>
  )
}