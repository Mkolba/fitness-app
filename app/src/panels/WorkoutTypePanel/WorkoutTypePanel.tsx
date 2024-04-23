import {
  Alert, Button,
  Div,
  Group,
  Placeholder,
  Spinner
} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkoutType} from "../../types";
import {api} from "../../api";
import {WorkoutTypeInfoBlock} from "../../components/";
import {useUserType} from "../../hooks";

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

  const showDeleteWorkoutTypeAlert = () => {
    router.showPopout(
      <Alert
        onClose={() => router.hidePopout()}
        header={'Подтвердите действие'}
        text={'Вы действительно хотите удалить тип тренировки?'}
        actions={[
          {
            title: 'Удалить',
            mode: 'destructive',
            action: deleteWorkoutType
          },
          {
            title: 'Отмена',
            mode: 'cancel',
          },
        ]}
      />
    )
  }

  const deleteWorkoutType = () => {
    api.deleteWorkoutType(Number(workoutTypeId)).then(() => {
      router.back();
    }).catch((e) => {
      router.showPopout(
        <Alert
          onClose={() => router.hidePopout()}
          header={'Произошла ошибка'}
          text={JSON.stringify(e)}
        />
      )
    })
  }

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      {workoutType ?
        <>
          <CommonPanelHeader>
            Тип тренировки
          </CommonPanelHeader>

          <WorkoutTypeInfoBlock workoutType={workoutType} editable/>

          {userType === 'sudo' &&
            <Group>
              <Div>
                <Button stretched appearance={'negative'} onClick={showDeleteWorkoutTypeAlert} size={'m'}>
                  Удалить тип тренировки
                </Button>
              </Div>
            </Group>
          }

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