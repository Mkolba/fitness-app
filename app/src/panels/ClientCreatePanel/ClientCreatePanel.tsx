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
  const [phone, setPhone] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const router = useRouteNavigator();

  const createClient = () => {
    if (firstName && lastName && phone) {
      router.showPopout(
        <ScreenSpinner/>
      )
      api.createClient(firstName, lastName, phone).then(data => {

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
        Новый клиент
      </CommonPanelHeader>

      <Group>
        <form onSubmit={e => e.preventDefault()}>
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
          <FormItem top={'Номер клиента'}>
            <Input
              status={(showErrors && !phone) ? 'error' : 'default'}
              placeholder={'Введите номер телефона'}
              value={phone}
              onChange={e => {
                setPhone(e.target.value);
                setShowErrors(false);
              }}
            />
          </FormItem>
          <FormItem>
            <Button onClick={createClient} stretched size={'m'}>
              Сохранить
            </Button>
          </FormItem>
        </form>
      </Group>
    </ProtectedPanel>
  )
}