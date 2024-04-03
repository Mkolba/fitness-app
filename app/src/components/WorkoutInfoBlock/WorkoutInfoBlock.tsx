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
  Icon20CalendarOutline, Icon20InfoCircleOutline,
  Icon20UserOutline, Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import {IClient, ITrainer, IWorkout, IWorkoutType, WorkoutStatusType} from "../../types";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ClientSelect} from "../ClientSelect/ClientSelect";
import {TrainerSelect} from "../TrainerSelect/TrainerSelect";
import {WorkoutTypeSelect} from "../WorkoutTypeSelect/WorkoutTypeSelect";

interface WorkoutInfoBlockProps {
  workout: IWorkout,
  editable: boolean
}

export const WorkoutInfoBlock: React.FC<WorkoutInfoBlockProps> = ({
  workout,
  editable
}) => {
  const [editMode, setEditMode] = useState(false)
  const [client, setClient] = useState<IClient>(workout.client)
  const [trainer, setTrainer] = useState<ITrainer>(workout.trainer)
  const [workoutType, setWorkoutType] = useState<IWorkoutType>(workout.workout_type)
  const [date, setDate] = useState<Date | undefined>(new Date(workout.date))
  const [status, setStatus] = useState(workout.status)
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const router = useRouteNavigator();

  const onSubmit = () => {
    if (date) {
      router.showPopout(<ScreenSpinner/>);
      api.editWorkout(workout.id, client.id, trainer.id, workoutType.id, date).then(() => {
        api.setWorkoutStatus(workout.id, status).catch(e => {})
        router.hidePopout();
        setEditMode(false);
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(undefined)}
            before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
          >
            Данные тренировки сохранены
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
            Не удалось отредактировать данные тренировки
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
            <MiniInfoCell before={<Icon20UserOutline/>}>
              Клиент: {client.first_name} {client.last_name}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20CalendarOutline/>}>
              {date ? date.toLocaleString() : 'н/д'}
            </MiniInfoCell>
            <MiniInfoCell before={<Icon20InfoCircleOutline/>}>
              {workoutType.title} — {workoutType.price}₽
            </MiniInfoCell>
            <MiniInfoCell before={
              status === 'done' ?
                <Icon16DoneCircle width={20} height={20} color={'var(--vkui--color_background_positive)'}/>
                :
                status === 'cancelled' ?
                  <Icon16CancelCircle width={18} height={18} color={'var(--vkui--color_background_negative)'}/>
                  :
                  <Icon16Clock width={18} height={18} color={'#ffa918'}/>
            }>
              Статус: {status === 'done' ? 'проведена' : status === 'cancelled' ? 'отменена' : 'запланирована'}
            </MiniInfoCell>
          </>
        }

        {editMode &&
          <form onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}>
            <FormItem top={'Клиент'}>
              <ClientSelect
                client={client}
                onChange={client => setClient(client)}
              />
              {/*<Input value={client} onChange={e => setClient(e.target.value)}/>*/}
            </FormItem>
            <FormItem top={'Тренер'}>
              <TrainerSelect
                trainer={trainer}
                onChange={trainer => setTrainer(trainer)}
              />
              {/*<Input value={client} onChange={e => setClient(e.target.value)}/>*/}
            </FormItem>
            <FormItem top={'Тип тренировки'}>
              <WorkoutTypeSelect
                workoutType={workoutType}
                onChange={workoutType => setWorkoutType(workoutType)}
              />
              {/*<Input value={client} onChange={e => setClient(e.target.value)}/>*/}
            </FormItem>
            <FormItem top={'Дата'}>
              <DateInput value={date} enableTime onChange={e => setDate(e)}/>
            </FormItem>
            <FormItem top={'Статус'}>
              <CustomSelect
                options={[
                  {
                    label: 'проведена',
                    value: 'done',
                    icon: <Icon16DoneCircle width={20} height={20} color={'var(--vkui--color_background_positive)'}/>
                  },
                  {
                    label: 'отменена',
                    value: 'cancelled',
                    icon: <Icon16CancelCircle width={18} height={18} color={'var(--vkui--color_background_negative)'}/>
                  },
                  {
                    label: 'запланирована',
                    value: 'pending',
                    icon: <Icon16Clock width={18} height={18} color={'#ffa918'}/>
                  },
                ]}
                value={status}
                onChange={e => setStatus(e.target.value as WorkoutStatusType)}
                renderOption={({option, ...restProps}) => (
                  <CustomSelectOption {...restProps} before={option.icon}/>
                )}
              />
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
  );
}