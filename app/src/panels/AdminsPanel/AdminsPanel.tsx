import './style.scss'
import React, {useEffect, useState} from "react";
import {
  Button,
  CardGrid,
  Group,
  PanelHeaderButton,
  Placeholder,
  Search,
  Spinner
} from "@vkontakte/vkui";
import {AdminCard, CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {
  Icon24UserAddOutline,
  Icon28AddSquareOutline,
  Icon56RudeMessageOutline,
  Icon56SearchOutline
} from "@vkontakte/icons";
import {IClient} from "../../types";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const AdminsPanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [search, setSearch] = useState('');
  const [admins, setAdmins] = useState<IClient[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const router = useRouteNavigator();

  useEffect(() => {
    setIsFetching(true);
    api.getAdmins().then(data => {
      setIsFetching(false);
      setAdmins(data || []);
    }).catch(() => {
      setIsFetching(false)
    })
  }, [])

  const applySearch = (admin: IClient) => {
    return (
      admin.first_name?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      admin.last_name?.toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }

  const filteredClients = (search && admins.length) ? admins.filter(applySearch) : admins;

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader root before={
        <PanelHeaderButton onClick={() => router.push('/admin/new')}>
          <Icon28AddSquareOutline color={'var(--vkui--color_background_accent_themed)'}/>
        </PanelHeaderButton>
      }>
        Администраторы
      </CommonPanelHeader>

      <Group>
        <Search value={search} onChange={e => setSearch(e.target.value)}/>
      </Group>

      <Group separator={'hide'}>
        {filteredClients.length ?
          <CardGrid size={'l'}>
            {filteredClients.map(item => (
              <AdminCard key={item.id} admin={item} mode={'outline-tint'}/>
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
                  router.push('/admin/new')
                }}>
                  Создать администратора
                </Button>
              }>
                Вы ещё не создавали администраторов
              </Placeholder>
        }
      </Group>
    </ProtectedPanel>
  )
}