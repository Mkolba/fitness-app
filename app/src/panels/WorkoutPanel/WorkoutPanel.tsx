import {
  Alert,
  Button,
  ButtonGroup,
  CardGrid,
  Div,
  Group,
  Header,
  Link,
  MiniInfoCell,
  Panel,
  PanelProps, Placeholder, Spinner
} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {CommonPanelHeader, TrainerCard, WorkoutInfoBlock} from "../../components";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkout} from "../../types";
import {api} from "../../api";
import {useUserType} from "../../hooks";

export const WorkoutPanel: React.FC<PanelProps> = ({
 nav
}) => {

  // @ts-ignore
  const {id: workoutId} = useParams()
  const [workout, setWorkout] = useState<IWorkout | null>(null);
  const userType = useUserType();
  const router = useRouteNavigator();

  useEffect(() => {
    if (workoutId) {
      api.getWorkout(Number(workoutId)).then(data => {
        setWorkout(data)
      }).catch(() => {})
    }
  }, [workoutId])

  const showDeleteWorkoutAlert = () => {
    router.showPopout(
      <Alert
        onClose={() => router.hidePopout()}
        header={'Подтвердите действие'}
        text={'Вы действительно хотите удалить тренировку?'}
        actions={[
          {
            title: 'Удалить',
            mode: 'destructive',
            action: deleteWorkout
          },
          {
            title: 'Отмена',
            mode: 'cancel',
          },
        ]}
      />
    )
  }

  const deleteWorkout = () => {
    api.deleteWorkout(Number(workoutId)).then(() => {
      router.back();
    }).catch(() => {

    })
  }

  return (
    <Panel nav={nav}>
      {workout ?
        <>
          <CommonPanelHeader>
            Карточка тренировки
          </CommonPanelHeader>

          <WorkoutInfoBlock workout={workout} editable={['admin', 'sudo'].includes(userType)}/>

          <Group header={<Header>Тренер</Header>}>
            <CardGrid size={'l'}>
              <TrainerCard trainer={workout.trainer} expandable={['admin', 'sudo'].includes(userType)}/>
            </CardGrid>
          </Group>

          {['admin', 'sudo'].includes(userType) &&
            <Group>
              <Div>
                <Button appearance={'negative'} stretched size={'l'} onClick={showDeleteWorkoutAlert}>
                  Удалить тренировку
                </Button>
              </Div>
            </Group>
          }
        </>
        :
        <>
          <CommonPanelHeader>
            Карточка тренировки
          </CommonPanelHeader>
          <Group>
            <Placeholder icon={<Spinner size={'large'}/>}/>
          </Group>
        </>
      }
    </Panel>
  )
}