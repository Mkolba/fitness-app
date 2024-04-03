import './style.scss'
import React, {useEffect, useState} from "react";
import {CardGrid, Group, Header, Link, Panel, PanelProps, Placeholder, Spinner} from "@vkontakte/vkui";
import {
  ClientInfoBlock,
  CommonPanelHeader,
  ProtectedPanel,
  ProtectedPanelProps,
  TrainerInfoBlock
} from "../../components";
import {WorkoutCard} from "../../components/WorkoutCard/WorkoutCard";
import {IClient, IWorkout} from "../../types";
import {api} from "../../api";
import {useParams} from "@vkontakte/vk-mini-apps-router";

export const ClientPanel: React.FC<ProtectedPanelProps> = ({
 nav,
  redirectTo
}) => {
  // @ts-ignore
  const {id: clientId} = useParams()

  const [client, setClient] = useState<IClient | null>(null);
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (clientId) {
      setIsFetching(true);
      api.getClient(Number(clientId)).then(data => {
        setIsFetching(false);
        setClient(data)
      }).catch(() => {
        setIsFetching(false);
      })

      api.getWorkoutsByClient(Number(clientId)).then(data => {
        setIsFetching(false);
        setWorkouts(data);
      }).catch(() => {
        setIsFetching(false)
      })
    }
  }, [clientId])


  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      {client ?
        <>
          <CommonPanelHeader>
            Карточка клиента
          </CommonPanelHeader>

          <ClientInfoBlock client={client} editable/>

          <Group header={<Header>Тренировки</Header>}>
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
                У этого клиента нет назначенных тренировок
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
    </ProtectedPanel>
  )
}