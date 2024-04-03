import React, {useEffect, useState} from "react";
import {Button, CardGrid, Group, PanelHeaderButton, PanelProps, Placeholder, Search, Spinner} from "@vkontakte/vkui";
import './style.scss';
import {ClientCard, CommonPanelHeader, ProtectedPanel, ProtectedPanelProps, WorkoutTypeCard} from "../../components";
import {
  Icon24UserAddOutline,
  Icon28AddSquareOutline,
  Icon56RudeMessageOutline,
  Icon56SearchOutline
} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkoutType} from "../../types";
import {api} from "../../api";

export const WorkoutTypesPanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const router = useRouteNavigator();
  const [search, setSearch] = useState('');
  const [workoutTypes, setWorkoutTypes] = useState<IWorkoutType[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    api.getWorkoutTypes().then(data => {
      setIsFetching(false);
      setWorkoutTypes(data || []);
    }).catch(() => {
      setIsFetching(false)
    })
  }, [])

  const applySearch = (workoutType: IWorkoutType) => {
    return (
      workoutType.title.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const filteredWorkoutTypes = (search && workoutTypes.length) ? workoutTypes.filter(applySearch) : workoutTypes;

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader root before={
        <PanelHeaderButton onClick={() => router.push('/workoutType/new')}>
          <Icon28AddSquareOutline color={'var(--vkui--color_background_accent_themed)'}/>
        </PanelHeaderButton>
      }>
        Типы тренировок
      </CommonPanelHeader>

      <Group>
        <Search value={search} onChange={e => setSearch(e.target.value)}/>
      </Group>

      <Group separator={'hide'}>
        {filteredWorkoutTypes.length ?
          <CardGrid size={'l'}>
            {filteredWorkoutTypes.map(item => (
              <WorkoutTypeCard key={item.id} workoutType={item} mode={'outline-tint'}/>
            ))}
          </CardGrid>
          :
          isFetching ?
            <Placeholder icon={<Spinner size={'large'}/>}/>
            :
            search ?
              <Placeholder icon={<Icon56SearchOutline/>}>
                Поисковый запрос не дал результатов
              </Placeholder>
              :
              <Placeholder header={'Ни-че-го'} icon={<Icon56RudeMessageOutline/>} action={
                <Button size={'m'} before={<Icon24UserAddOutline/>} onClick={() => {
                  router.push('/workoutType/new')
                }}>
                  Создать тип тренировки
                </Button>
              }>
                Вы ещё не создавали типы тренировок
              </Placeholder>
        }
      </Group>
    </ProtectedPanel>
  )
}