import React, {useEffect, useState} from "react";
import {
  Button,
  CardGrid,
  Group,
  Panel,
  PanelHeaderButton,
  Placeholder,
  Search, Spinner
} from "@vkontakte/vkui";
import './style.scss';
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps, TrainerCard} from "../../components";
import {
  Icon24UserAddOutline,
  Icon28AddSquareOutline,
  Icon56RudeMessageOutline,
  Icon56SearchOutline
} from "@vkontakte/icons";
import {ITrainer} from "../../types";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";
import {useUserType} from "../../hooks";


export const TrainersPanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [trainers, setTrainers] = useState<ITrainer[]>([]);
  const [search, setSearch] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouteNavigator();
  const userType = useUserType();

  useEffect(() => {
    setIsFetching(true);
    api.getTrainers().then(data => {
      setIsFetching(false);
      setTrainers(data || []);
    }).catch(() => {
      setIsFetching(false);
    })
  }, [])

  const applySearch = (trainer: ITrainer) => {
    return (
      trainer.first_name?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      trainer.last_name?.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const filteredTrainers = (search && trainers.length) ? trainers.filter(applySearch) : trainers;

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader root before={
        userType === 'sudo' &&
          <PanelHeaderButton onClick={() => router.push('/trainer/new')}>
            <Icon28AddSquareOutline color={'var(--vkui--color_background_accent_themed)'}/>
          </PanelHeaderButton>
      }>
        Тренеры
      </CommonPanelHeader>

      <Group>
        <Search value={search} onChange={e => setSearch(e.target.value)}/>
      </Group>

      <Group separator={'hide'}>
        {filteredTrainers.length ?
          <CardGrid size={'l'}>
            {filteredTrainers.map(item => (
              <TrainerCard key={item.id} trainer={item} mode={'outline-tint'}/>
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
              userType === 'sudo' &&
                <Button size={'m'} before={<Icon24UserAddOutline/>} onClick={() => {
                  router.push('/trainer/new')
                }}>
                  Создать тренера
                </Button>
            }>
              Вы ещё не создавали тренеров
            </Placeholder>
        }
      </Group>
    </ProtectedPanel>
  )
}