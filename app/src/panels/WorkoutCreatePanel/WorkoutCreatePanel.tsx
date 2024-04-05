import React, {useState} from "react";
import './style.scss'
import {
  Button, ButtonGroup,
  CustomSelect,
  CustomSelectOption,
  DateInput,
  FormItem,
  Group,
  Input,
  Panel,
  PanelProps, ScreenSpinner
} from "@vkontakte/vkui";
import {
  ClientSelect,
  CommonPanelHeader,
  ProtectedPanel,
  ProtectedPanelProps,
  TrainerSelect,
  WorkoutTypeSelect
} from "../../components";
import {IClient, ITrainer, IWorkoutType, WorkoutStatusType} from "../../types";
import {Icon16CancelCircle, Icon16Clock, Icon16DoneCircle} from "@vkontakte/icons";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const WorkoutCreatePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [showErrors, setShowErrors] = useState(false);
  const [client, setClient] = useState<IClient | undefined>(undefined)
  const [trainer, setTrainer] = useState<ITrainer | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [workoutType, setWorkoutType] = useState<IWorkoutType | undefined>(undefined);
  const router = useRouteNavigator();

  const onSubmit = () => {
    if (client && trainer && date && workoutType) {
      router.showPopout(
        <ScreenSpinner/>
      )

      api.createWorkout(client.id, trainer.id, workoutType.id, date).then(data => {

      }).catch(() => {

      }).finally(() => {
        router.hidePopout();
        router.back();
      })
    } else {
     setShowErrors(true);
    }
  }

  return (
    <ProtectedPanel nav={nav} redirectTo={redirectTo}>
      <CommonPanelHeader>
        Новая тренировка
      </CommonPanelHeader>

      <Group>
        <FormItem top={'Клиент'}>
          <ClientSelect
            status={(showErrors && !client) ? 'error' : 'default'}
            client={client}
            onChange={client => {
              setClient(client);
              setShowErrors(false);
            }}
          />
        </FormItem>
        <FormItem top={'Тренер'}>
          <TrainerSelect
            status={(showErrors && !trainer) ? 'error' : 'default'}
            trainer={trainer}
            onChange={trainer => {
              setTrainer(trainer);
              setShowErrors(false);
            }}
          />
        </FormItem>
        <FormItem top={'Тип тренировки'}>
          <WorkoutTypeSelect
            status={(showErrors && !trainer) ? 'error' : 'default'}
            workoutType={workoutType}
            onChange={workoutType => {
              setWorkoutType(workoutType);
              setShowErrors(false);
            }}
          />
        </FormItem>
        <FormItem top={'Дата'}>
          <DateInput
            status={(showErrors && !date) ? 'error' : 'default'}
            value={date}
            enableTime
            onChange={e => {
              setDate(e);
              setShowErrors(false);
            }}
          />
        </FormItem>
        <FormItem>
          <ButtonGroup stretched>
            <Button stretched onClick={onSubmit}>
              Сохранить
            </Button>
            <Button appearance={'negative'} onClick={onSubmit}>
              Отмена
            </Button>
          </ButtonGroup>
        </FormItem>
      </Group>
    </ProtectedPanel>
  )
}