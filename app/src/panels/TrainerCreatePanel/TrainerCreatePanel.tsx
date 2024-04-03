import React, {useState} from "react";
import './style.scss'
import {Button, FormItem, Group, Input, Panel, PanelProps, ScreenSpinner} from "@vkontakte/vkui";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {api} from "../../api";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const TrainerCreatePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showErrors,setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const createTrainer = () => {
    if (firstName && lastName) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createTrainer(firstName, lastName).then(data => {

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
        Новый тренер
      </CommonPanelHeader>

      <Group>
        <form onSubmit={e => e.preventDefault()}>
          <FormItem top={'Имя тренера'}>
            <Input
              status={(showErrors && !firstName) ? 'error' : 'default'}
              placeholder={'Введите имя'}
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem top={'Фамилия тренера'}>
            <Input
              status={(showErrors && !lastName) ? 'error' : 'default'}
              placeholder={'Введите фамилию'}
              value={lastName}
              onChange={e => {
                setLastName(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem>
            <Button onClick={createTrainer} stretched size={'m'}>
              Сохранить
            </Button>
          </FormItem>
        </form>
      </Group>
    </ProtectedPanel>
  )
}