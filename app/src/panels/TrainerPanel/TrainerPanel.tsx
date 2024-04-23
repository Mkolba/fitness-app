import {
  Card,
  CardGrid, Div,
  Group,
  Header,
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
  const [todaySalary, setTodaySalary] = useState<number | 'loading'>('loading');
  const [monthSalary, setMonthSalary] = useState<number | 'loading'>('loading');
  const userType = useUserType();
  const router = useRouteNavigator();

  useEffect(() => {
    if (trainerId) {
      api.getTrainer(Number(trainerId)).then(data => {
        setTrainer(data)
      }).catch(() => {})

      if (['sudo', 'admin'].includes(userType)) {
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

      if (userType === 'trainer') {
        api.getTodayTrainerSalary().then((data) => {
          setTodaySalary(data.cash)
        })

        api.getMonthTrainerSalary().then((data) => {
          setMonthSalary(data.cash)
        })
      }
    }
  }, [trainerId])

  return (
    <Panel nav={nav}>
      {trainer ?
        <>
          <CommonPanelHeader root={!['sudo', 'admin'].includes(userType)} after={userType === 'trainer' &&
            <PanelHeaderButton onClick={() => {
              localStorage.removeItem('jwt-access-token');
              router.replace('/login');
            }}>
              <Icon24DoorArrowRightOutline color={'var(--vkui--color_background_negative)'}/>
            </PanelHeaderButton>
          }>
            Карточка тренера
          </CommonPanelHeader>

          <TrainerInfoBlock trainer={trainer} editable={['sudo', 'admin'].includes(userType)}/>

          {userType === 'trainer' &&
            <Group header={<Header>Заработок</Header>}>
              <CardGrid size={'m'}>
                <Card>
                  <Div>
                    {todaySalary === 'loading' ?
                      <Spinner size={'medium'}/>
                      :
                      <span>
                        За сегодня:<br/>{todaySalary}₽
                      </span>
                    }
                  </Div>
                </Card>
                <Card>
                  <Div>
                    {monthSalary === 'loading' ?
                      <Spinner size={'medium'}/>
                      :
                      <span>
                        За месяц:<br/>{monthSalary}₽
                      </span>
                    }
                  </Div>
                </Card>
              </CardGrid>
            </Group>
          }

          <Group>
            {workouts.length ?
              <CardGrid size={'l'}>
                {
                  workouts.map(item => (
                    <WorkoutCard workout={item} key={item.id} showChevron={false} showSalary={userType === 'trainer'}/>
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