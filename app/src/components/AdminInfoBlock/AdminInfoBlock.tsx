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
  Icon20CopyOutline, Icon20LockOutline,
  Icon20UserOutline, Icon20UserTagOutline,
  Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {IClient} from "../../types";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";
import {copyTextToClipboard} from "../../utils";

interface AdminInfoBlockProps {
  admin: IClient,
  editable: boolean
}

export const AdminInfoBlock: React.FC<AdminInfoBlockProps> = ({
  admin,
  editable=true
}) => {
  const [editMode, setEditMode] = useState(false)
  const [firstName, setFirstName] = useState(admin.first_name)
  const [lastName, setLastName] = useState(admin.last_name)
  const [login, setLogin] = useState('admin') // admin.login;
  const [password, setPassword] = useState('admin') // admin.password;

  const [snackbar, setSnackbar] = useState<React.ReactNode>(undefined);
  const router = useRouteNavigator();

  const onSubmit = () => {
    router.showPopout(<ScreenSpinner/>);
    api.editAdmin(admin.id, firstName, lastName, login, password).then(() => {
      router.hidePopout();
      setEditMode(false);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Данные администратора сохранены
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
          Не удалось отредактировать данные администратора
        </Snackbar>
      )
    })
  }

  const copyPassword = () => {
    try {
      copyTextToClipboard(password);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Пароль администратора скопирован
        </Snackbar>
      )
    } catch {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
          Не удалось скопировать пароль
        </Snackbar>
      )
    }
  }

  const copyLogin = () => {
    try {
      copyTextToClipboard(login);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Логин администратора скопирован
        </Snackbar>
      )
    } catch {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
          Не удалось скопировать логин
        </Snackbar>
      )
    }
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
              {firstName} {lastName}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20UserTagOutline/>} mode={'more'} after={<Icon20CopyOutline/>} onClick={copyLogin}>
              {login}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20LockOutline/>} mode={'more'} after={<Icon20CopyOutline/>} onClick={copyPassword}>
              {password}
            </MiniInfoCell>
          </>
        }
        {editMode &&
          <form onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}>
            <FormItem top={'Имя'}>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)}/>
            </FormItem>
            <FormItem top={'Фамилия'}>
              <Input value={lastName} onChange={e => setLastName(e.target.value)}/>
            </FormItem>
            <FormItem top={'Логин'}>
              <Input value={login} onChange={e => setLogin(e.target.value)}/>
            </FormItem>
            <FormItem top={'Пароль'}>
              <Input value={password} onChange={e => setPassword(e.target.value)}/>
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