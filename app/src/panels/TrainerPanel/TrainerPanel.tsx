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
import {CommonPanelHeader} from "../../components";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ITrainer, IWorkout} from "../../types";
import {api} from "../../api";
import {TrainerInfoBlock} from "../../components/";
import {WorkoutCard} from "../../components/WorkoutCard/WorkoutCard";
import {useUserType} from "../../hooks";
import {Icon24DoorArrowRightOutline} from "@vkontakte/icons";

export const TrainerPanel: React.FC<PanelProps> = ({
  nav
}) => {

  // @ts-ignore
  const {id: trainerId} = useParams()
  const [trainer, setTrainer] = useState<ITrainer | null>(null);
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const userType = useUserType();
  const router = useRouteNavigator();

  useEffect(() => {
    if (trainerId) {
      api.getTrainer(Number(trainerId)).then(data => {
        setTrainer(data)
      }).catch(() => {})

      if (userType === 'admin') {
        api.getWorkoutsByTrainer(Number(trainerId)).then(data => {
          setWorkouts(data)
        }).catch(() => {})
      } else {
        let toDate = new Date();
        toDate.setFullYear(toDate.getFullYear() + 1);
        api.getWorkoutsByInterval(new Date(), toDate).then(data => {
          setWorkouts(data)
        }).catch(() => {})
      }
    }
  }, [trainerId])

  return (
    <Panel nav={nav}>
      {trainer ?
        <>
          <CommonPanelHeader root={userType !== 'admin'} after={userType === 'trainer' &&
            <PanelHeaderButton onClick={() => {
              localStorage.removeItem('jwt-access-token');
              router.replace('/login');
            }}>
              <Icon24DoorArrowRightOutline color={'var(--vkui--color_background_negative)'}/>
            </PanelHeaderButton>
          }>
            Карточка тренера
          </CommonPanelHeader>

          <TrainerInfoBlock trainer={trainer} editable={userType === 'admin'}/>

          <Group header={<Header aside={userType === 'admin' && <Link>Добавить</Link>}>Тренировки</Header>}>
            {workouts.length ?
              <CardGrid size={'l'}>
                {
                  workouts.map(item => (
                    <WorkoutCard workout={item} key={item.id} showChevron={false}/>
                  ))
                }
              </CardGrid>
              :
              <Placeholder>
                У этого тренера нет назначенных тренировок
              </Placeholder>
            }
          </Group>
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
    </Panel>
  )
}