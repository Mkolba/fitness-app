import React, {useState} from "react";
import './style.scss'
import {
  Button,
  ButtonGroup,
  Div,
  FormItem,
  Group,
  Header,
  Input,
  Link,
  MiniInfoCell, ScreenSpinner,
  Snackbar,
  Textarea
} from "@vkontakte/vkui";
import {
  Icon20ArticleOutline,
  Icon20CopyOutline,
  Icon20KeyOutline, Icon20PhoneOutline,
  Icon20UserOutline,
  Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {IClient} from "../../types";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";
import {copyTextToClipboard} from "../../utils";

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
  const [phone, setPhone] = useState(client.phone_number)
  const [snackbar, setSnackbar] = useState<React.ReactNode>(undefined);
  const router = useRouteNavigator();

  const onSubmit = () => {
    router.showPopout(<ScreenSpinner/>);
    api.editClient(client.id, firstName, lastName, phone).then(() => {
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

  const copyPhone = () => {
    try {
      copyTextToClipboard(client.phone_number);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Номер клиента скопирован
        </Snackbar>
      )
    } catch {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
          Не удалось скопировать номер
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
            <MiniInfoCell before={<Icon20PhoneOutline/>} mode={'more'} after={<Icon20CopyOutline/>} onClick={copyPhone}>
              {phone}
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
            <FormItem top={'Номер телефона'}>
              <Input value={phone} onChange={e => setPhone(e.target.value)}/>
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