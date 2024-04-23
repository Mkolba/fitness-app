import React, {useState} from "react";
import './style.scss'
import {Button, FormItem, Group, Input, ScreenSpinner} from "@vkontakte/vkui";
import {CommonPanelHeader, ProtectedPanel, ProtectedPanelProps} from "../../components";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {api} from "../../api";

export const ClientCreatePanel: React.FC<ProtectedPanelProps> = ({
  nav,
  redirectTo
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [surname, setSurname] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const onSubmit = () => {
    if (firstName && lastName) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createClient(firstName, lastName, surname).then(() => {

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
        Новый клиент
      </CommonPanelHeader>

      <Group>
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}>
          <FormItem top={'Имя клиента'}>
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
          <FormItem top={'Фамилия клиента'}>
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
          <FormItem top={'Отчество клиента'}>
            <Input
              placeholder={'Введите отчество клиента'}
              value={surname}
              onChange={e => {
                setSurname(e.target.value);
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