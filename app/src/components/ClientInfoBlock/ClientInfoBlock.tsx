import React, {useState} from "react";
import './style.scss'
import {
  Button,
  ButtonGroup,
  FormItem,
  Group,
  Header,
  Input,
  Link,
  MiniInfoCell, ScreenSpinner,
  Snackbar
} from "@vkontakte/vkui";
import {
  Icon20UserOutline,
  Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {IClient} from "../../types";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";

interface ClientInfoBlockProps {
  client: IClient,
  editable: boolean
}

export const ClientInfoBlock: React.FC<ClientInfoBlockProps> = ({
  client,
  editable=true
}) => {
  const [editMode, setEditMode] = useState(false)
  const [firstName, setFirstName] = useState(client.first_name)
  const [lastName, setLastName] = useState(client.last_name)
  const [surname, setSurname] = useState(client.surname)
  const [snackbar, setSnackbar] = useState<React.ReactNode>(undefined);
  const router = useRouteNavigator();

  const onSubmit = () => {
    router.showPopout(<ScreenSpinner/>);
    api.editClient(client.id, firstName, lastName, surname).then(() => {
      router.hidePopout();
      setEditMode(false);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Данные клиента сохранены
        </Snackbar>
      )
    }).catch((e) => {
      console.log(e)
      router.hidePopout();
      setEditMode(false);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
          Не удалось отредактировать данные клиента
        </Snackbar>
      )
    })
  }

  return (
    <>
      <Group header={
        <Header aside={(editable && !editMode) && <Link onClick={() => setEditMode(true)}>Редактировать</Link>}>
          Профиль
        </Header>
      }>
        {!editMode &&
          <>
            <MiniInfoCell before={<Icon20UserOutline/>}>
              {lastName} {firstName} {surname}
            </MiniInfoCell>
          </>
        }
        {editMode &&
          <form onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}>
            <FormItem top={'Фамилия'}>
              <Input value={lastName} onChange={e => setLastName(e.target.value)}/>
            </FormItem>
            <FormItem top={'Имя'}>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)}/>
            </FormItem>
            <FormItem top={'Отчество'}>
              <Input value={surname} onChange={e => setSurname(e.target.value)}/>
            </FormItem>
            <FormItem>
              <ButtonGroup stretched>
                <Button stretched onClick={onSubmit}>
                  Сохранить
                </Button>
                <Button appearance={'negative'} onClick={() => setEditMode(false)}>
                  Отмена
                </Button>
              </ButtonGroup>
            </FormItem>
          </form>
        }
      </Group>
      {snackbar}
    </>
  )
}