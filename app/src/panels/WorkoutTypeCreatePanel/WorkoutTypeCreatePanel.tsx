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
  const [price, setPrice] = useState('');
  const [showErrors,setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const onSubmit = () => {
    if (title && price) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createWorkoutType(title, Number(price)).then(data => {

      }).catch(() => {

      }).finally(() => {
        router.hidePopout();
        setTimeout(() => router.back(), 200);
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
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}>
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
                setPrice(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem>
            <Button onClick={onSubmit} stretched size={'m'}>
              Сохранить
            </Button>
          </FormItem>
        </form>
      </Group>
    </ProtectedPanel>
  )
}