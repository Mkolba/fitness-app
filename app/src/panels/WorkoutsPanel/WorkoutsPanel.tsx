import React, {useEffect, useState} from "react";
import {
  Button,
  CardGrid,
  DateInput,
  FormItem, FormLayoutGroup,
  Group, Header,
  PanelHeaderButton,
  Placeholder,
  Search,
  Spinner
} from "@vkontakte/vkui";
import './style.scss';
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {WorkoutCard} from "../../components/WorkoutCard/WorkoutCard";
import {
  Icon24UserAddOutline, Icon28AddSquareOutline,
  Icon56RudeMessageOutline,
  Icon56SearchOutline
} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {IWorkout} from "../../types";
import {api} from "../../api";

export const WorkoutsPanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [search, setSearch] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const router = useRouteNavigator();

  useEffect(() => {
    if (dateFrom && dateTo) {
      setIsFetching(true);
      api.getWorkoutsByInterval(dateFrom, dateTo).then(data => {
        setIsFetching(false);
        setWorkouts(data || []);
      }).catch(() => {
        setIsFetching(false);
      })
    }
  }, [dateFrom, dateTo])

  const applySearch = (workout: IWorkout) => {
    return (
      workout.trainer.first_name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      workout.trainer.last_name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      workout.client.first_name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      workout.client.last_name.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const filteredWorkouts = (search && workouts.length) ? workouts.filter(applySearch) : workouts;


  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader
        root
        before={
          <PanelHeaderButton onClick={() => {
            router.push('/workout/new')
          }}>
            <Icon28AddSquareOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </PanelHeaderButton>
        }
      >
        Тренировки
      </CommonPanelHeader>

      <Group>
        <Search value={search} onChange={e => setSearch(e.target.value)}/>
        <Group mode={'plain'} header={<Header mode={'secondary'}>Показывать тренировки</Header>}>
          <FormLayoutGroup mode={'horizontal'}>
            <FormItem top={'Начиная с:'}>
              <DateInput
                value={dateFrom}
                status={!dateFrom ? 'error' : 'default'}
                onChange={e => setDateFrom(e as Date)}
              />
            </FormItem>
            <FormItem top={'До:'}>
              <DateInput
                value={dateTo}
                status={!dateTo ? 'error' : 'default'}
                onChange={e => setDateTo(e as Date)}
              />
            </FormItem>
          </FormLayoutGroup>
        </Group>
      </Group>

      <Group>
        {filteredWorkouts.length ?
          <CardGrid size={'l'}>
            {filteredWorkouts.map(item => (
              <WorkoutCard key={item.id} workout={item} mode={'outline-tint'} showChevron={false}/>
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
                  router.push('/workout/new')
                }}>
                  Создать тренировку
                </Button>
              }>
                На сегодня нет запланированных тренировок
              </Placeholder>
        }
      </Group>
    </ProtectedPanel>
  )
}