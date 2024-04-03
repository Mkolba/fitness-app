import React, {useState} from "react";
import './style.scss'
import {Button, FormItem, Group, Input, Panel, PanelProps, ScreenSpinner} from "@vkontakte/vkui";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";

export const WorkoutTypeCreatePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [showErrors,setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const createWorkoutType = () => {
    if (title && price) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createWorkoutType(title, price).then(data => {

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
        Новый тип тренировки
      </CommonPanelHeader>

      <Group>
        <form onSubmit={e => e.preventDefault()}>
          <FormItem top={'Наименование типа'}>
            <Input
              status={(showErrors && !title) ? 'error' : 'default'}
              placeholder={'Введите наименование'}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem top={'Цена тренировки, ₽'}>
            <Input
              status={(showErrors && !price) ? 'error' : 'default'}
              placeholder={'Введите цену тренировки'}
              value={price}
              type={'number'}
              onChange={e => {
                setPrice(Number(e.target.value));
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem>
            <Button onClick={createWorkoutType} stretched size={'m'}>
              Сохранить
            </Button>
          </FormItem>
        </form>
      </Group>
    </ProtectedPanel>
  )
}