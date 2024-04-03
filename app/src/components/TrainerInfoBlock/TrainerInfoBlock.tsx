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
  Icon20KeyOutline,
  Icon20UserOutline,
  Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {ITrainer} from "../../types";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {copyTextToClipboard} from "../../utils";

interface TrainerInfoBlockProps {
  trainer: ITrainer,
  editable: boolean
}

export const TrainerInfoBlock: React.FC<TrainerInfoBlockProps> = ({
  trainer,
  editable=true
}) => {
  const [editMode, setEditMode] = useState(false)
  const [firstName, setFirstName] = useState(trainer.first_name)
  const [lastName, setLastName] = useState(trainer.last_name)
  const [snackbar, setSnackbar] = useState<React.ReactNode>(undefined);
  const router = useRouteNavigator();

  const onSubmit = () => {
    router.showPopout(<ScreenSpinner/>);
    api.editTrainer(trainer.id, firstName, lastName).then(() => {
      router.hidePopout();
      setEditMode(false);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Данные тренера сохранены
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
          Не удалось отредактировать данные тренера
        </Snackbar>
      )
    })
  }

  const copyToken = () => {
    try {
      copyTextToClipboard(trainer.token);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
        >
          Секретный ключ тренера скопирован
        </Snackbar>
      );
    } catch {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(undefined)}
          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
          Не удалось скопировать ключ
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
            <MiniInfoCell before={<Icon20KeyOutline/>} mode={'more'} after={<Icon20CopyOutline/>} onClick={copyToken}>
              {trainer.token}
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