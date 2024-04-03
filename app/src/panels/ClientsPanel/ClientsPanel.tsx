import './style.scss'
import React, {useEffect, useState} from "react";
import {
  Button,
  CardGrid,
  Group,
  Panel,
  PanelHeaderButton,
  PanelProps,
  Placeholder,
  Search,
  Spinner
} from "@vkontakte/vkui";
import {ClientCard, CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {
  Icon24UserAddOutline,
  Icon28AddSquareOutline,
  Icon56RudeMessageOutline,
  Icon56SearchOutline
} from "@vkontakte/icons";
import {IClient} from "../../types";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const ClientsPanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [search, setSearch] = useState('');
  const [clients, setClients] = useState<IClient[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const router = useRouteNavigator();

  useEffect(() => {
    setIsFetching(true);
    api.getClients().then(data => {
      setIsFetching(false);
      setClients(data || []);
    }).catch(() => {
      setIsFetching(false)
    })
  }, [])

  const applySearch = (client: IClient) => {
    return (
      client.first_name?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      client.last_name?.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const filteredClients = (search && clients.length) ? clients.filter(applySearch) : clients;

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader root before={
        <PanelHeaderButton onClick={() => router.push('/client/new')}>
          <Icon28AddSquareOutline color={'var(--vkui--color_background_accent_themed)'}/>
        </PanelHeaderButton>
      }>
        Клиенты
      </CommonPanelHeader>

      <Group>
        <Search value={search} onChange={e => setSearch(e.target.value)}/>
      </Group>

      <Group separator={'hide'}>
        {filteredClients.length ?
          <CardGrid size={'l'}>
            {filteredClients.map(item => (
              <ClientCard key={item.id} client={item} mode={'outline-tint'}/>
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
                  router.push('/client/new')
                }}>
                  Создать клиента
                </Button>
              }>
                Вы ещё не создавали клиентов
              </Placeholder>
        }
      </Group>
    </ProtectedPanel>
  )
}