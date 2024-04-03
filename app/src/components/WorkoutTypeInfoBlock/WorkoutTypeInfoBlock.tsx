import React, {useState} from "react";
import './style.scss'
import {
  Button,
  ButtonGroup, CustomSelect, CustomSelectOption,
  DateInput,
  Div,
  FormItem,
  Group,
  Header,
  Input,
  Link,
  MiniInfoCell, ScreenSpinner, Select, Snackbar,
  Textarea
} from "@vkontakte/vkui";
import {
  Icon16CancelCircle, Icon16Clock,
  Icon16DoneCircle,
  Icon20ArticleOutline,
  Icon20CalendarOutline, Icon20RoubleOutline, Icon20TextOutline,
  Icon20UserOutline, Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {IClient, ITrainer, IWorkout, IWorkoutType, WorkoutStatusType} from "../../types";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ClientSelect} from "../ClientSelect/ClientSelect";
import {TrainerSelect} from "../TrainerSelect/TrainerSelect";

interface WorkoutTypeInfoBlockProps {
  workoutType: IWorkoutType,
  editable: boolean
}

export const WorkoutTypeInfoBlock: React.FC<WorkoutTypeInfoBlockProps> = ({
  workoutType,
  editable
}) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(workoutType.title);
  const [price, setPrice] = useState(workoutType.price);
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const router = useRouteNavigator();

  const onSubmit = () => {
    if (title && price) {
      router.showPopout(<ScreenSpinner/>);
      api.editWorkoutType(workoutType.id, workoutType.title, workoutType.price).then(() => {
        router.hidePopout();
        setEditMode(false);
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(undefined)}
            before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
          >
            Данные типа тренировки сохранены
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
            Не удалось отредактировать данные типа тренировки
          </Snackbar>
        )
      })
    }
  }

  return (
    <>
      <Group header={
        <Header aside={(editable && !editMode) && <Link onClick={() => setEditMode(true)}>Редактировать</Link>}>
          Данные
        </Header>
      }>
        {!editMode &&
          <>
            <MiniInfoCell before={<Icon20TextOutline/>}>
              Название: {title}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20RoubleOutline/>}>
              Цена: {price}₽
            </MiniInfoCell>
          </>
        }

        {editMode &&
          <form onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}>
            <FormItem top={'Наименование'}>
              <Input value={title} onChange={e => setTitle(e.target.value)}/>
            </FormItem>
            <FormItem top={'Цена тренировки'}>
              <Input value={price} type={'number'} onChange={e => setPrice(Number(e.target.value))}/>
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
      {/*<Group>*/}
      {/*  <Div>*/}
      {/*    <Button appearance={'negative'} stretched size={'l'}>*/}
      {/*      Удалить тип тренировки*/}
      {/*    </Button>*/}
      {/*  </Div>*/}
      {/*</Group>*/}
      {snackbar}
    </>
  )
}